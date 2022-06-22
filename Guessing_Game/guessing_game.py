from random import randint
LOW = 1
HIGH = 10
def input_sanitization(user_input: str) -> int:
    while True:  
        if user_input.isnumeric():
            if int(user_input) <= HIGH and int(user_input) >= LOW:
                return int(user_input)
            else:
                print(f"Enter a number with in range {LOW} and {HIGH}")
        else:
            print("Enter a valid number")
        user_input = input(f"Guess the number between {LOW}-{HIGH}: ")

def check_user_guess(user_guess: int, computer_guess: int) -> bool:
    if user_guess > computer_guess or user_guess < computer_guess:
        return False
    else:
        return True

def main():
    life_counter = 3
    print(f"You've got {life_counter} guesses")

    user_input = input(f"Guess the number between {LOW}-{HIGH}: ")
    computer_guess = randint(LOW,HIGH)
    user_guess = input_sanitization(user_input)

    while not check_user_guess(user_guess, computer_guess) and life_counter != 1:
        life_counter -= 1
        print(f"You've got {life_counter} guesses")
        user_guess = input(f"Guess the number between {LOW}-{HIGH}: ")
        user_guess = input_sanitization(user_guess)
        
    if check_user_guess(user_guess, computer_guess):
        print("You Won!")
    else:
        print("You lost!")
        print(f"And BTW, it was {computer_guess}")

if __name__ == '__main__':
    main()