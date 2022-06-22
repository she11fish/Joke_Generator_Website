import http
from http.client import InvalidURL
import requests
from bs4 import *
import wget
import urllib.request
from re import findall
from typing import List

def find_file(url: str, ext: str) -> List[str]:
    return findall(fr'(https:\/\/.+\.{ext})'.format(ext), requests.get(url).text)
                    
def main():
   url = input("Enter a URL: ")
   file = input("Enter an extension file: ")

   try:
        list_of_urls = find_file(url, file) 

   except requests.exceptions.MissingSchema:
        print("An Error occured while fetching the files")
        exit(1)

   if not list_of_urls:
      print("No files are found with the provided URL")
      exit(1)     

   for i, urls in enumerate(list_of_urls):
        try:
            file_name = urllib.request.urlretrieve(urls, f"image{i+1}.{file}") 
            print(f"File {file_name} successfully retrieved!!")
        except InvalidURL:
            print("Files cannot be fetched from the URL provided")
            exit(1)
       
if __name__ == "__main__":
    main()