'use strict';

const account1 = {
  owner: 'James Bond',
  movements: [200, 450, -400, 3000, -650.25, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2022-01-18T21:31:17.178Z',
    '2022-02-23T07:42:02.383Z',
    '2022-03-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-06-08T14:11:59.604Z',
    '2022-06-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2022-11-27T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400.23, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2022-01-01T13:15:33.035Z',
    '2022-02-24T09:48:16.867Z',
    '2022-03-25T06:04:23.907Z',
    '2022-04-25T14:18:46.235Z',
    '2022-05-05T16:33:06.386Z',
    '2022-06-10T14:43:26.374Z',
    '2022-07-25T18:49:59.371Z',
    '2022-08-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340.17, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700.24, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

let user, timer;

// BLOCK DARK-LIGHT mode
let showLight = document.getElementById('light');
let showDark = document.getElementById('dark');
let color = '#fff';
showLight.classList.add('hide');

function toggler() {
  document.body.classList.toggle('dark-mode');
  showDark.classList.toggle('hide');
  showLight.classList.toggle('hide');
  color = color === '#fff' ? 'rgb(129, 126, 126)' : '#fff';
  document.querySelector('.movements').style.backgroundColor = color;
  document.querySelectorAll('.btn_dark_light').forEach(i => {
    // FIXME Color variable not working properly for buttons, maybe browser related issue, that is the reson for the redundancy below
    i.style.color = color === '#fff' ? 'rgb(129, 126, 126)' : '#fff';
  });
}

showLight.addEventListener('click', () => toggler());
showDark.addEventListener('click', () => toggler());

// BLOCK UI update
function updateFinances(user) {
  displayMovements(user);
  calcDisplayBalance(user);
  displayTransactionTotals(user);
}

// BLOCK Logout
const logOut = () => {
  updateFinances(null);
  containerApp.style.opacity = '0';
  labelWelcome.textContent = 'Login to get started';
  timer = null;
};

// BLOCK Start Timer
const startTimer = () => {
  let time = 300; //seconds
  const tick = function () {
    const min = Math.trunc(time / 60);
    const sec = time % 60;
    labelTimer.textContent = `${String(min).padStart(2, '0')}:${String(
      sec
    ).padStart(2, '0')}`;
    if (time <= 0) {
      logOut();
      clearInterval(timer);
      modalToggler('You have been automatically loggedout');
    }
    time--;
  };
  const timer = setInterval(tick, 1000);
  return timer;
};

// BLOCK Reset timer due to activity
const resetTimer = function () {
  clearInterval(timer);
  timer = startTimer();
};

// BLOCK Login and Get User
const createUserInitials = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => {
        return name[0];
      })
      .join('');
  });
};

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  createUserInitials(accounts);
  user = accounts.find(
    acc => acc.username === inputLoginUsername.value.toLowerCase()
  );

  if (!user || user.pin !== +inputLoginPin.value) {
    modalToggler('You have entered wrong credentials. Try again.');
  } else if (user.pin === +inputLoginPin.value) {
    if (timer) clearInterval(timer);
    labelWelcome.innerHTML = `Welcome, ${user.owner}.`;
    updateFinances(user);
    const now = new Date();
    labelDate.textContent =
      now.toLocaleDateString(navigator.language) +
      ', ' +
      now.getHours() +
      ':' +
      now.getMinutes();
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // Makes field loose focus
    containerApp.style.opacity = '100%';
    timer = startTimer();
  }
});

// BLOCK Display Movements
function daysAgo(date) {
  return Math.trunc(((new Date(date) - new Date()) / 1000 / 60 / 60 / 24) * -1);
}

const displayMovements = function (accHolder, sort = false) {
  containerMovements.innerHTML = '';
  const movCopy = sort
    ? user.movements.slice().sort((a, b) => a - b)
    : user.movements;

  if (accHolder) {
    movCopy.forEach((mov, idx) => {
      const spaceHolder = ' ';
      const displayDate = accHolder.movementsDates
        ? new Date(accHolder.movementsDates[idx]).toLocaleDateString()
        : spaceHolder;

      let ago = displayDate !== spaceHolder ? daysAgo(displayDate) : 'none';

      if (+ago === 0) ago = 'today';
      if (+ago === 1) ago = 'yesterday';
      if (+ago <= 7) ago = `${ago} days ago`;
      if (+ago > 7) ago = ``;
      if (ago === 'none') ago = ' ';

      const transactionType = mov > 0 ? 'deposit' : 'withdrawal';
      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">${
        idx + 1
      } ${transactionType}</div>
        <div class="movements__date">${displayDate} </div>
        <div style="margin-left:10px" class="movements__date">${ago}</div>
        <div class="movements__value">${Intl.NumberFormat(
          accHolder.locale || 'en-US',
          {
            style: 'currency',
            currency: accHolder.currency || 'USD',
          }
        ).format(mov)}</div>
      </div>
    `;
      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  }
};

// BLOCK Calculate Summary
const calcDisplayBalance = function (accHolder) {
  if (!accHolder) {
    labelBalance.textContent = '';
  } else {
    accHolder.balance = accHolder.movements.reduce((acc, mov) => {
      return acc + mov;
    }, 0);
    labelBalance.textContent = Intl.NumberFormat(accHolder.locale || 'en-US', {
      style: 'currency',
      currency: accHolder.currency || 'USD',
    }).format(accHolder.balance);
  }
};

const displayTransactionTotals = function (accHolder) {
  if (accHolder) {
    labelSumIn.textContent = Intl.NumberFormat(accHolder.locale || 'en-US', {
      style: 'currency',
      currency: accHolder.currency || 'USD',
    }).format(
      accHolder.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => {
          acc += mov;
          return acc;
        }, 0)
    );
    labelSumOut.textContent = Intl.NumberFormat(accHolder.locale || 'en-US', {
      style: 'currency',
      currency: accHolder.currency || 'USD',
    }).format(
      accHolder.movements.reduce((acc, mov) => {
        acc = mov < 0 ? acc - mov : (acc = acc);
        return acc; //NOTE don't cast in return of reduce it will behace weird.
      }, 0)
    );

    // Interest over $1 will be paid
    labelSumInterest.textContent = Intl.NumberFormat(
      accHolder.locale || 'en-US',
      {
        style: 'currency',
        currency: accHolder.currency || 'USD',
      }
    ).format(
      accHolder.movements
        .filter(mov => mov > 0)
        .map(mov => (mov * accHolder.interestRate) / 100)
        .filter(interest => interest >= 1)
        .reduce((acc, interest) => {
          acc += interest;
          return acc;
        }, 0)
        .toFixed(2)
    );
  } else {
    labelSumOut.textContent = '';
    labelSumInterest.textContent = '';
    labelSumIn.textContent = '';
  }
};

// BLOCK Transfer
// Automatically add decimals
inputTransferAmount.addEventListener('blur', () => {
  inputTransferAmount.value = Number(inputTransferAmount.value).toFixed(2);

  if (user.balance < Number(inputTransferAmount.value)) {
    inputTransferAmount.style.color = 'red';
  } else if (user.balance > Number(inputTransferAmount.value)) {
    inputTransferAmount.style.color = 'black';
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receivingAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (!receivingAccount || receivingAccount.username === user.username) {
    modalToggler('Receiving account has not been found.');
  } else if (user.balance < amount) {
    modalToggler('Transfer amount exceeds available balance.');
  } else if (amount < 0) {
    modalToggler('Transfer amount must not be less than zero.');
  } else {
    receivingAccount.movements.push(amount);
    receivingAccount.movementsDates.push(new Date());
    user.movements.push(-amount);
    if (user.movementsDates) user.movementsDates.push(new Date());
    updateFinances(user);
    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    modalToggler('Success!');
    resetTimer();
  }
});

// BLOCK Loan. Bank loans money if there is at least one deposit of 10% of a requested amount
// Automatically add decimals
inputLoanAmount.addEventListener('blur', () => {
  inputLoanAmount.value = Number(inputLoanAmount.value).toFixed(2);
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  const underwriter = user.movements.some(mov => mov >= loanAmount * 0.1);
  console.log(underwriter);
  if (underwriter && loanAmount > 0) {
    modalToggler('You loan request has been approved.');
    user.movements.push(loanAmount);
    if (user.movementsDates) user.movementsDates.push(new Date());
    updateFinances(user);
    inputLoanAmount.value = '';
    resetTimer();
  } else {
    modalToggler('You loan request has been denied.');
  }
});

// BLOCK Close Account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  const userIdx = accounts.findIndex(acc => acc.username === user.username);
  if (
    !user ||
    user.username !== inputCloseUsername.value ||
    Number(inputClosePin.value) !== user.pin
  ) {
    modalToggler('Wrong credentials.');
  } else {
    accounts.splice(userIdx, 1);
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    updateFinances(null);
    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'You do not have active accounts :(';
    modal.insertAdjacentHTML(
      'beforeend',
      '<div class="end"><button onClick="location.reload();" style="width:100px; height:30px; margin-right:10px;" >Reload.</button><button onClick="modalToggler(); document.querySelector(`.end`).remove();" style="width:200px; height:30px;">Continue with existing data.</button></div>'
    );
    setTimeout(() => modalToggler('What do you want to do next?'), 1000);
  }
});

// BLOCK Sort
let sorted = 0;
btnSort.addEventListener('click', () => {
  if (!sorted) {
    btnSort.innerHTML = '&uparrow; SORT';
    sorted = !sorted;
    displayMovements(user, true);
  } else {
    btnSort.innerHTML = '&downarrow; SORT';
    sorted = !sorted;
    displayMovements(user, false);
  }
});

// BLOCK MODAL CLOSE
function modalToggler(message) {
  modal.classList.toggle('hide');
  overlay.classList.toggle('hide');
  document.querySelector('.modal-message').textContent = message;
}
// Close on X
btnCloseModal.addEventListener('click', () => {
  modalToggler();
});

// Close when click outside modal
overlay.addEventListener('click', () => {
  modalToggler();
});

// Close on Escape. If statement is not necessary but it avoids running code if modal is not open.
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!modal.classList.contains('hide')) {
      modalToggler();
    }
  }
});

// BLOCK EXTRAS
// Deposits over certain amount
const depositsOverAmount = function (amount) {
  const deposits = accounts
    .flatMap(acc => acc.movements)
    .reduce((count, i) => (i >= amount ? ++count : count), 0);
  return deposits;
};

// Total deposist and withdrawals
const totals = function (accounts) {
  const result = accounts
    .flatMap(acc => acc.movements)
    .reduce(
      (total, i) => {
        // i > 0 ? (total.deposits += i) : (total.withdrawals += i);
        total[i > 0 ? 'deposits' : 'withdrawals'] += i;
        return total;
      },
      { deposits: 0, withdrawals: 0 }
    );
  return result;
};

// Capitalize messages
function convertMessage(message) {
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const newMessage = message
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return newMessage;
}

const { deposits, withdrawals } = totals(accounts);
console.log(
  `At the beginning of the demo account totals:\nTotal deposits over $1000: ${depositsOverAmount(
    1000
  )},\nTotal deposits: $${deposits},\nTotal withdrawals: $${withdrawals} `
);
