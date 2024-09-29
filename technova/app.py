import streamlit as st
import google.generativeai as genai
import os
import docx2txt
import PyPDF2 as pdf
from dotenv import load_dotenv
import json
import requests

# try:
#     google_api_key = st.secrets["GOOGLE_API_KEY"]  # Check if deployed on Streamlit Cloud
# except KeyError:
#     # If running locally, fall back to .env file
#     google_api_key = os.getenv("GOOGLE_API_KEY")  # Use .env file locally

# if google_api_key is None:
#     st.error("API key not found! Please check your configuration.")
#     st.stop()

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

generation_config = {
    "temperature": 0,
    "top_p":1,
    "top_k": 32,
    "max_output_tokens": 4096
}

safety_settings = [
    {"category": f"HARM_CATEGORY_{category}", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
    for category in ["HARASSMENT", "HATE_SPEECH", "SEXUALLY_EXPLICIT", "DANGEROUS_CONTENT"]
]

def generate_response_from_gemini(input_text):
    llm = genai.GenerativeModel(
        model_name="gemini-pro",
        generation_config=generation_config,
        safety_settings=safety_settings,
    )
    output = llm.generate_content(input_text)

    return output.text

def extract_text_from_pdf_file(uploaded_file):
    pdf_reader = pdf.PdfReader(uploaded_file)
    text_content = ""
    for page in pdf_reader.pages:
        text_content += str(page.extract_text())
    return text_content

def extract_text_from_docx_file(uploaded_file):
    return docx2txt.process(uploaded_file)

system_prompt = """
As an experienced Applicant Tracking System (ATS) scanner,
with profound knowledge in technology, software engineering, data science, data analyst,
AI architect, AI Engineer, and big data engineering, your role involves evaluating resumes against job description.
Your goal is to analyze the resume against the given job description,
assign a percentage match based on key criteria, and pinpoint missing keywords accurately.
resume:{text}
description:{job_description}

Ensure that:
- No text is added before or after the JSON.
- All keys and string values use double quotes `"`.
- There are no trailing commas.
- Do not use markdown formatting or code blocks.
- Each keywords should be concise 
I want the response in one single string having the following structure:
{{"ATS Score":"%", 
"Missing Keywords":"",
"Candidate Summary":""}} 
"""

# Streamlit app
# Initialize Streamlit app
page_bg_css = """
<style>
    body {
        background-color: black;
        
    }
    .stApp {
        background-color: #F9E7E3;
        color: black;
    }
    h1 {
        color: #41281D;
        text-align: center;
    }
    .stButton>button {
        color: #ffffff;
        background-color: #41281D;
        border-radius: 5px;
        padding: 0.5em 1em;
    }
    .textarea {
        background-color: #ffffff; /* Light blue background */
        color: #000;               /* Black text color */
        border: 2px solid #66b2ff; /* Border color */
        border-radius: 10px;       /* Rounded corners */
        padding: 10px;             /* Padding inside the text box */
    }

    /* Style the file uploader (Resume upload button) */
    .stFileUploader {
        background-color: #fff7e6;  /* Light orange background */
        border: 2px dashed #ff6600; /* Dashed border */
        padding: 20px;              /* Padding inside the upload box */
        border-radius: 10px;        /* Rounded corners */
    }

    /* Style the file uploader text */
    .stFileUploader label {
        color: #ffffff;            /* Orange color for the label */
    }
</style>
"""
st.markdown(page_bg_css, unsafe_allow_html=True)
st.title("Intelligent ATS Scanner")
job_description = st.text_area("Paste the Job Description", height=300)
uploaded_file = st.file_uploader("Upload Your Resume", type=["pdf", "docx"], help="Please upload a PDF or Doc file")
submit_button = st.button("Submit")
if submit_button:
    if uploaded_file is not None:
        if uploaded_file.type == "application/pdf":
            resume_text = extract_text_from_pdf_file(uploaded_file)
        elif uploaded_file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            resume_text = extract_text_from_docx_file(uploaded_file)
        else:
            st.error("Unsupported file type. Please upload a PDF or DOCX file.")
            resume_text = ""

        if resume_text:
            # Prepare the prompt by injecting resume and job description
            prompt = system_prompt.format(text=resume_text, job_description=job_description)
            try:
                # Generate response from the AI model
                response_text = generate_response_from_gemini(prompt)
                
                ats_score = response_text.split('"ATS Score":"')[1].split('"')[0]
                ats_pctg = float(ats_score.rstrip('%'))

                missing_keywords = response_text.split('"Missing Keywords":"')[1].split('"')[0]
                candidate_summary = response_text.split('"Candidate Summary":"')[1].split('"')[0]

                # Display the results with separate subheadings
                st.subheader("ATS Evaluation Result:")
                
                st.markdown("#### ATS Score")
                st.write(ats_score)

                st.markdown("#### Missing Keywords")
                st.write(missing_keywords)

                st.markdown("#### Candidate Summary")
                st.write(candidate_summary)

                # Provide hiring recommendation based on ATS Score
                try:
                    if ats_pctg >= 75:
                        st.success("**Recommendation:** Move forward with hiring.")
                    else:
                        st.warning("**Recommendation:** Not a match.")
                except ValueError:
                    st.error("Invalid ATS Score format.")
            
            except json.JSONDecodeError:
                st.error("Failed to parse the response from the AI model. Please ensure the response is in valid JSON format.")
            except Exception as e:
                st.error(f"An unexpected error occurred: {e}")
        