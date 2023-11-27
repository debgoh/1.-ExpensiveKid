import express from "express";
import bodyParser from "body-parser";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = Number(process.env.PORT) || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Array to store transaction history
let transactionHistory = [];

app.get("/", (req, res) => {

    // Calculate total income amount
    const totalIncomeAmount = transactionHistory
    .filter(transaction => transaction.amountText > 0)
    .reduce((total, transaction) => total + transaction.amountText, 0);

    // Calculate total expense amount
    const totalExpenseAmount = transactionHistory
    .filter(transaction => transaction.amountText < 0)
    .reduce((total, transaction) => total + transaction.amountText, 0);

    // Calculate balance
    const balance = totalIncomeAmount + totalExpenseAmount;

    res.render("index.ejs", {
        descriptiveText: "item",
        amountText: "amount",
        transactionHistory: transactionHistory,
        totalIncomeAmount: totalIncomeAmount.toFixed(2),
        totalExpenseAmount: totalExpenseAmount.toFixed(2),
        balance: balance.toFixed(2),
    });
});

app.post("/submit", (req, res) => {
    const descriptiveText = req.body.descriptiveText;
    const amountText = parseFloat(req.body.amountText);

// Add the new transaction to the history
transactionHistory.push({
    descriptiveText: descriptiveText,
    amountText: amountText,
});

// Calculate total income amount
const totalIncomeAmount = transactionHistory
.filter(transaction => transaction.amountText > 0)
.reduce((total, transaction) => total + transaction.amountText, 0);

 // Calculate total expense amount
const totalExpenseAmount = transactionHistory
    .filter(transaction => transaction.amountText < 0)
    .reduce((total, transaction) => total + transaction.amountText, 0);

// Calculate balance
const balance = totalIncomeAmount + totalExpenseAmount;

res.render("index.ejs", {
    descriptiveText: descriptiveText,
    amountText: amountText,
    transactionHistory: transactionHistory,
    totalIncomeAmount: totalIncomeAmount.toFixed(2),
    totalExpenseAmount: totalExpenseAmount.toFixed(2),
    balance: balance.toFixed(2),
    });
});

app.get("/deleteTransaction/:index", (req, res) => {
    const index = req.params.index;

    // Remove the transaction at the specified index
    if (index >= 0 && index < transactionHistory.length) {
        transactionHistory.splice(index, 1);
    }

    // Redirect back to the main page
    res.redirect("/");
});


app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
