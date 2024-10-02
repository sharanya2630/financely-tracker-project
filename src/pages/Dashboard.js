import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { Modal } from "antd";
import AddExpense from "../components/Modals/addExpense";
import AddIncome from "../components/Modals/addIncome";
import { addDoc, collection, getDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import { toast } from "react-toastify";
import TransactionsTable from "../components/TransactionsTable";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };
  const onFinish = (values, type) => {
    const amount = parseFloat(values.amount) || 0;
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      tag: values.tag,
      name: values.name,
      amount: amount,
    };
    addTransaction(newTransaction);
    console.log("values :", values, type);
  };
  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transaction`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
      setTransactions((prevTransactions) => [...prevTransactions, transaction]);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }
  useEffect(() => {
    fetchTransactions();
  }, [user]);
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };
  // async function fetchTransactions() {
  //   setLoading(true);
  //   if (user) {
  //     const q = query(collection(db, `users/${user.uid}/transactions`));
  //     const querySnapshot = await getDocs(q);
  //     let transactionsArray = [];
  //     querySnapshot.forEach((doc) => {
  //       transactionsArray.push(doc.data());
  //     });
  //     setTransactions(transactionsArray);
  //     console.log("Transactions Array", transactionsArray);
  //     toast.success("Transactions Fetched!");
  //   }
  //   setLoading(false);
  // }
  async function fetchTransactions() {
    setLoading(true);
    try {
      if (user) {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        let transactionsArray = [];
        querySnapshot.forEach((doc) => {
          transactionsArray.push(doc.data());
        });
        setTransactions(transactionsArray);
        console.log("Transactions Array", transactionsArray);
        toast.success("Transactions Fetched!");
      }
    } catch (error) {
      console.error("Error fetching transactions: ", error);
      toast.error("Error fetching transactions.");
    }
    setLoading(false);
  }
  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {/* <Modal
        style={{ fontWeight: 600 }}
        title="Add Income"
        visible={isIncomeModalVisible}
        onCancel={handleIncomeCancel}
        footer={null}
      >
        Income
      </Modal> */}
          {/* <Modal
        style={{ fontWeight: 600 }}
        title="Add Expense"
        onCancel={handleExpenseCancel}
        footer={null}
        visible={isExpenseModalVisible}
      >
        Expense
      </Modal> */}

          {transactions&&transactions.length != 0 ? (
            <ChartComponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}
          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}
export default Dashboard;
