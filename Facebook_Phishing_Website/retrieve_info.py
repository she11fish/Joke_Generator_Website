from bs4 import BeautifulSoup
from facebook_phishing_website import find_email_by_name, find_password_by_name, get_html, get_jsons_from_file

def bubble_sort(l):
    """Sorts a list of usernames with bubble_sort.
    
    Compares the first element by the second element in a list.
    If the first element is greater, then the element is swapped with the second one.
    It goes to next element and repeats until the end of the list. This whole process
    repeats again for the length of the list times.

    Args:
        l ([]): the list to be sorted.
    
    Returns:
        ([]): the sorted list.

    """

    for _ in range(len(l)):
        for k in range(len(l)-1):
            if l[k].lower() > l[k+1].lower():
                l[k], l[k+1] = l[k+1], l[k]
    return l

def get_data_by_name(data_file, identifier):
    """Gets data from the database file and forms a list by name.
    
    Args:
        data_file ([{str:[]}]): the data file.
        identifier: the name to be forming a list creating by.

    Returns:
        ([]): the list of names fetched from the data file.

    """
    names = []
    for user_data in data_file:
        names.append(user_data[identifier][0])
    return names

def binary_search(target, l):
    """Finds the target in a list with binary search.
    
    Finds the middle index of low and high values and checks if the element at that
    index is equal to target. If it is, it returns mid. O/W, it would check if the element at 
    the index is greater than the targe value. If it is, then high value is set to mid. Or else,
    low value would be mid then it recaculates the mid of low and high. It repeats this process
    until it gets the element at mid or low as the target.
    
    Args:
        target (str): the target to to be searching.
        l ([]): the list to search from.

    Returns:
        (int): the index of the target value. 

    """

    high = len(l)
    low = 0
    while low < high:
        mid = (high + low) // 2
        if l[mid] == target:
            return mid
        if l[mid] > target:
            high = mid
        if l[mid] < target:
            low = mid
    return low

def main():
    html = get_html() 
    soup = BeautifulSoup(html, "html.parser")
    user_name = find_email_by_name(soup, 'input', 'type')
    pass_name = find_password_by_name(soup, 'input', 'type')
    data_file = get_jsons_from_file()
    emails = get_data_by_name(data_file, user_name)
    passwords = get_data_by_name(data_file, pass_name)

    dict_data = {}
    for email, password in zip(emails, passwords):
        dict_data[email] = password
    sorted_emails = bubble_sort(emails)
    print(sorted_emails)
    user_input = input("Which email would you like to see? ")

    while not user_input in sorted_emails:
        print(f'Sorry, no email with the name {user_input}')
        user_input = input("Which email would you like to see? ") 

    index = binary_search(user_input, emails)
    intended_password = dict_data[sorted_emails[index]]
    print(intended_password)

if __name__ == '__main__':
    main()