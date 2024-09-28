import os
import pinecone
from flask import Flask, request, jsonify
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Pinecone
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from pinecone import ServerlessSpec

# Initialize Flask app
app = Flask(__name__)

# Initialize Pinecone using the new Pinecone class
pinecone_instance = pinecone.Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)

# Ensure your index exists or create it if it doesn't
index_name = "technovaproj"

# Load OpenAI embeddings and connect to Pinecone
embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
index = Pinecone(pinecone_instance.Index(index_name), embeddings)

# Define a prompt template
prompt_template = PromptTemplate(input_variables=["question"], template="Use the following job description to prepare: {question}")

# Define a route for the chatbot
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    question = data['question']
    docs = index.similarity_search(question)  # Perform similarity search
    chain = load_qa_chain(OpenAI(), chain_type="stuff")
    answer = chain.run(input_documents=docs, question=question)
    
    return jsonify({"answer": answer})

# Run the Flask app
if __name__ == "__main__":
    app.run(port=5000, debug=True)
