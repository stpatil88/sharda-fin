# hf_summarize.py
import os
import requests
import json
from typing import Optional, Dict, Any

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL = "Qwen/Qwen2.5-7B-Instruct"  # Updated to a more reliable model

def summarize(text: str, max_length: int = 120) -> str:
    """
    Summarize text using Hugging Face API
    
    Args:
        text: Text to summarize
        max_length: Maximum length of summary
    
    Returns:
        Summarized text
    """
    if not HF_TOKEN:
        print("Warning: HF_TOKEN not found, returning truncated text")
        return text[:max_length] + "..." if len(text) > max_length else text
    
    if not text or len(text.strip()) < 10:
        return text
    
    url = f"https://api-inference.huggingface.co/models/{MODEL}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    
    # Create a proper prompt for summarization
    prompt = f"Summarize the following text in {max_length} characters or less:\n\n{text}\n\nSummary:"
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": max_length,
            "temperature": 0.7,
            "do_sample": True,
            "return_full_text": False
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        
        # Handle different response formats
        if isinstance(result, list) and len(result) > 0:
            if "generated_text" in result[0]:
                summary = result[0]["generated_text"].strip()
            elif "summary_text" in result[0]:
                summary = result[0]["summary_text"].strip()
            else:
                summary = str(result[0]).strip()
        elif isinstance(result, dict):
            summary = result.get("generated_text", str(result)).strip()
        else:
            summary = str(result).strip()
        
        # Clean up the summary
        summary = summary.replace("Summary:", "").strip()
        
        # Fallback to simple truncation if summary is too long or empty
        if not summary or len(summary) > max_length * 2:
            summary = text[:max_length] + "..." if len(text) > max_length else text
        
        return summary
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Hugging Face API: {e}")
        # Fallback to simple truncation
        return text[:max_length] + "..." if len(text) > max_length else text
    except Exception as e:
        print(f"Unexpected error in summarization: {e}")
        return text[:max_length] + "..." if len(text) > max_length else text

def batch_summarize(texts: list, max_length: int = 120) -> list:
    """
    Summarize multiple texts
    
    Args:
        texts: List of texts to summarize
        max_length: Maximum length of each summary
    
    Returns:
        List of summarized texts
    """
    summaries = []
    for text in texts:
        summary = summarize(text, max_length)
        summaries.append(summary)
    return summaries

if __name__ == "__main__":
    # Test the summarization
    test_text = """
    The stock market experienced significant volatility today as investors reacted to the latest economic data. 
    The Dow Jones Industrial Average fell by 200 points in early trading, while the S&P 500 and NASDAQ also 
    showed declines. Analysts attribute the market movement to concerns about inflation and potential interest 
    rate hikes by the Federal Reserve. Technology stocks were particularly affected, with major tech companies 
    seeing their share prices drop by 3-5%. Energy stocks, however, showed resilience as oil prices continued 
    to rise due to supply chain disruptions.
    """
    
    print("Testing summarization...")
    summary = summarize(test_text)
    print(f"Original length: {len(test_text)}")
    print(f"Summary length: {len(summary)}")
    print(f"Summary: {summary}")
