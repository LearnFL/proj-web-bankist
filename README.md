# Java Script Based Banking Application

## Purpose
The purspose of this project was to practice JavaScript by creating a banking app without using third party libraries. The main focus was concentrated on working with DOM, arrays, strings etc. It was not my goal to build a fully functional web application that supports authentication, feels and looks like a real online banking. 

## Process
JavaScript, HTML, CSS. Inspired by Jonas Schmedtmann, implementation is completely mine, I made multiple modifications to the original challenge.

#### Users
There are 4 users that use different currencies. For some users banking data contains timestamps of the transaction, for some users there is no transation timestamp. That was done on purpose.

#### Logins
1. User name: jb, pin: 1111
2. User name: jd, pin: 2222
3. User name: stw, pin: 3333
4. User name: ss, pin: 4444

## Functionality
1. The app implements basic dark mode and light mode UI. Insteadof Icons I used emojis, for this reason it may look differently on different computers.
2. The app automatically creates 'user name' out of account holders' names. User name is not case sensitive. If login data is incorrect the user will be notified.
3. Currency. The app will automatically display account holders currency type.
4. If user's data contains transaction timestamps they will be displayed. If the transaction took a place today or yesterday, instead of displaying a date it wills say 'TODAY' or 'YESTERDAY'. 
5. Auto logout. After a successfull login a timeout timer will start and after 5 minutes of inacctivity a user will be logged out. If a user makes a transaction a timer will reset.
6. Sorting. You can sort transactions.
7. Transfers. You cannot transfer money to your self. After an ammount was entered two decdimals will be added automatically. Transaction will be reflected on sender's and receiver's transaction history. Ammount of a transafer must greater than zero.
8. Transaction type. The app will automatically determine a transaction type.
9. Number format. Numbers will be presented according to user's 'locale'.
10. Loan. A user must have at leat 10% of a requested ammount on deposit.  After an ammount was entered two decdimals will be added automatically. Transaction will be reflected on sender's and receiver's transaction history. Ammount of a transafer must greater than zero otherwise a loan request will be denied.
11. Close account. Only account holder may close account. Once closed you will be presented two options: reload the app or continue with the existing data and remaining users.

## See live page
[visit the page](https://learnfl.github.io/proj-web-bankist/)

## Video Introduction on YouTube
[Video](https://youtu.be/G_C3BJlRKEs)


## Screenshots
![Screen Shot 2022-12-07 at 8 59 09 PM](https://user-images.githubusercontent.com/86169204/206338069-9a1f75f9-1e83-4a63-b22a-6a50deb4732b.png)
![Screen Shot 2022-12-08 at 9 34 41 AM](https://user-images.githubusercontent.com/86169204/206473749-b8032cbd-e29b-43ab-a06b-af846ae924c2.png)

