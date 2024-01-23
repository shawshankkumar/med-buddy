# Project Name

## Description

This project is a [FastAPI](https://fastapi.tiangolo.com/) application that communicates with an LLM (Language Model) to generate data from PDF medical reports. The application provides an API endpoint that accepts PDF files and returns the generated data in a structured format.

## Features

- Communicates with an LLM to generate data from PDF medical reports
- Provides a RESTful API endpoint for uploading PDF files and retrieving generated data
- Supports handling multiple concurrent requests efficiently using FastAPI's asynchronous capabilities
- Validates the uploaded PDF files to ensure they meet the required format and structure
- Provides detailed error handling and informative error messages for better debugging


## Prompt

We are trying to build a system that can extract structured data from PDF, image and docx medical reports. We are building an API using FastAPI to injest the files which saves the reports and also returns the structured data. This structured data is then compared to with a data set we have acquired from kaggle. A LLM (gpt, llama or gemini) is then used to generate a summary of the report, nutritional advice, and a diagnosis. The generated data is then returned to the user. The report is also saved for the user so that it can be accessed later. A chat window also opens so that the user can interact with and talk to the llm with the entire context. A speech to text and text to speech feature can be added so that the person can talk to the report instead of typing. We are also aiming at allowing multiple languages and building a very accessible system, a mobile app and a website if time permits. 



## Sprint ideas
