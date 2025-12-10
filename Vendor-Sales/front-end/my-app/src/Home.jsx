import React, {useEffect, useState, useRef, useContext} from "react";
import styles from './Home.module.css';
import { UserDataContext } from './UserDataContext.jsx';
import axios from 'axios';

function Home() {
  const [calcValue, setCalcValue] = useState("");
  const [calcError, setCalcError] = useState("");
  const [groupedValue, setGroupedValue] = useState([]);
  const [result, setResult] = useState(null);
  const [redLight, setRedLight] = useState({});
  const [searchNumber, setSearchNumber] = useState([]);
  const [searchName, setSearchName] = useState([]);
  const inputRefs = useRef({});
  const [customerData, setCustomerData] = useState({
    name: '',
    phoneNo: '',
  })
  const [customersNameAndPhNo, setCustomersNameAndPhNo] = useState({name: [], phNo: []});
  const userData = useContext(UserDataContext);
  const [selectedNameAndPhNo, setSelectedNameAndPhNo] = useState({
    name: "", phNo: ""
  });
const calcInputRef = useRef(null);

useEffect(() => {  
  // Set customer data when selected from search
  if(customerData.name.length > 0) {
        console.log("Stoppppppppppppppppp", selectedNameAndPhNo);
  userData.data.customers.forEach((customer) => {
    if (customer.name.toLowerCase() === selectedNameAndPhNo.name.toLowerCase) {
      setCustomerData({
        name: customer.name,
        phoneNo: customer.phoneNo
      });
    }
  });
  // Set customer data when selected from search
} else if (customerData.phoneNo.length > 0) {
    userData.data.customers.forEach((customer) => {
    if (customer.phoneNo === selectedNameAndPhNo.phNo) {
      console.log("selected true");
      
      setCustomerData({
        name: customer.name,
        phoneNo: customer.phoneNo
      });
    }
    });
}
},[selectedNameAndPhNo]);

  //
  useEffect(() => {
    let customersData = {name: [], phNo: []};
    // console.log(userData);
    
    for (let i = 0; i < userData?.data?.customers?.length || 0; i++) {
      customersData.name.push(userData.data.customers[i].name);      
      customersData.phNo.push(userData.data.customers[i].phoneNo);
      console.log(userData.data.customers[i]);
    }

    setCustomersNameAndPhNo(customersData);
    console.log('data setted');
    
  },[userData]);

  useEffect(() => {
    // Search phone numbers
    if (customerData.phoneNo.length > 0) {
    let phoneNoArr = customersNameAndPhNo.phNo;
    let input = customerData.phoneNo;
    let arr = [];
        for (let i = 0; i < phoneNoArr.length; i++) {
          let currPhNo = phoneNoArr[i]// 978278232
          let currValue = currPhNo.slice(0,input.length);
          if(input === currValue) {
            arr.push(currPhNo)
          }
        }
        // let a = ["8732832327", "3232409923", "232323232323", "232323232323", "232323232323"]
        setSearchNumber(arr);
      }
          // Search names 
        if (customerData.name.length > 0) {
              let nameArr = customersNameAndPhNo.name;
    let input = customerData.name.toLowerCase();
    let arr = [];
        for (let i = 0; i < nameArr.length; i++) {
          let currName = nameArr[i].toLowerCase(); // 978278232
          let currValue = currName.slice(0,input.length);
          if(input === currValue) {
            arr.push(currName)
          }
        }
        setSearchName(arr);
        }
  },[customerData])

      useEffect(() => {
      console.log(searchNumber);
    },[searchNumber])

  useEffect(() => {
    if (!calcValue) {
      setGroupedValue([]);
      setResult(null);
      return;
    }

const extractGroups = (expression) => {
  const cleanExpr = expression.replace(/\s+/g, "");
  const tokens = cleanExpr.split(/([+\-])/).filter(Boolean);
  const groups = [];

  for (let i = 0, id = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "+" || token === "-") continue;
    const next = tokens[i + 1];
    if(token === "+" && next === "+") {
      alert("Invalid Expression");      
      tokens.pop();
    }
    let isMultiply;
    
    if (tokens[i].includes("*") && next === "+" ) {
      let splitMultiply = tokens[i].split("*");
      isMultiply = ( (/\d/.test(splitMultiply[0])) && (/\d/.test(splitMultiply[1]))) ? true : false;
    }
    
    const isComplete =
      ((/\d/.test(token)) && (next || next === "+" || next === "-")) || isMultiply;
      
    // if user typed plain number without operator yet, treat as incomplete
    const expr =
      token.includes("*") || token.includes("/") ? token : `${token}*1`;

    groups.push({ id: id++, expr, confirmed: isComplete });
  }

  return groups;
};


    const evaluateExpression = (expr) => {
      if(expr.endsWith("*") || expr.endsWith("+")) expr = expr.slice(0, -1);
      if (!expr || !expr.trim()) return null;
      const tokens = expr.trim().match(/\d+(\.\d+)?|[+\-*/()]/g);
      if (!tokens) return null;

      const outputQueue = [];
      const operatorStack = [];
      const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };
      const isOperator = (t) => ["+", "-", "*", "/"].includes(t);

      for (const token of tokens) {
        if (!isNaN(token)) {
          outputQueue.push(parseFloat(token));
        } else if (isOperator(token)) {
          while (
            operatorStack.length &&
            isOperator(operatorStack.at(-1)) &&
            precedence[operatorStack.at(-1)] >= precedence[token]
          ) {
            outputQueue.push(operatorStack.pop());
          }
          operatorStack.push(token);
        } else if (token === "(") operatorStack.push(token);
        else if (token === ")") {
          while (operatorStack.at(-1) !== "(")
            outputQueue.push(operatorStack.pop());
          operatorStack.pop();
        }
      }

      while (operatorStack.length) outputQueue.push(operatorStack.pop());
      const evalStack = [];

      for (const token of outputQueue) {
        if (!isNaN(token)) evalStack.push(token);
        else {
          const b = evalStack.pop();
          const a = evalStack.pop();
          switch (token) {
            case "+": evalStack.push(a + b); break;
            case "-": evalStack.push(a - b); break;
            case "*": evalStack.push(a * b); break;
            case "/": evalStack.push(a / b); break;
          }
        }
      }
      console.log(evalStack);
      
      return evalStack[0];
    };

    const extracted = extractGroups(calcValue);

setGroupedValue((prev) => {
  return extracted.map((g, idx) => {
    const prevItem = prev[idx];

    let amount = 0;
    try {
      amount = Function(`"use strict"; return (${g.expr})`)();
      if (isNaN(amount)) amount = 0;
    } catch {
      amount = 0;
    }
    let split = g.expr.split("*");
    return {
      id: idx + 1,
      expr: g.expr,
      quantity: split[1] || 1,
      price: split[0] ,
      confirmed: g.confirmed,
      name: prevItem?.name ?? "",
      amount,
    };
  });
});

    const r = evaluateExpression(calcValue);
    setResult(r);
  }, [calcValue]);

  const handleNameChange = (id, value) => {
    setGroupedValue((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: value } : g))
    );
  };

  // When a group becomes confirmed and has no name
  useEffect(() => {
    const latestConfirmed = groupedValue.find(
      (g) => g.confirmed && !g.name?.trim()
    );
    if (latestConfirmed) {
      const ref = inputRefs.current[latestConfirmed.id];
      if (ref && document.activeElement !== ref) {
        ref.focus();
      }
    }
  }, [groupedValue]);

  useEffect(() => {
    checkItemNameExist(calcValue);
  },[calcValue])

  const checkItemNameExist = (currValue) => {
    const latestConfirmed = groupedValue.find(g => g.confirmed && !g.name?.trim());
    const valuesWithoutName = groupedValue.filter(g => g.name === ""?.trim());
    
    if(valuesWithoutName.length > 0) {
      setRedLight(...valuesWithoutName);
    } else {
        setRedLight({});
    }
    
    if (latestConfirmed) {
      alert("Please enter item name before adding next calculation");
      inputRefs.current[latestConfirmed.id]?.focus();
      return;
    }
                  setCalcValue(() => currValue);

        const checkValidExpression = (expression) => {          
          console.log("expressio[0]");
          if(!/\d/.test(expression[0])) return;
                    console.log(calcValue, "<--");

          const operators = expression.match(/[*+]/g) || [];
          console.log(operators);
          
          for (let i = 0; i < expression.length; i++) {
            if ((expression[i] === "+" && expression[i+1] === "+") || (expression[i] === "*" && expression[i+1] === "*")) {
              console.log("**/++");
              setCalcError("Invalid Expression: Consecutive operators");
              setCalcValue((prev) => prev.slice(0, -1));
              return;
            }
            if (operators.length > 1) {
                  if (operators[i] === '*') {
                    if (i !== 0 && operators[i - 1] !== '+') {
                      setCalcError("Invalid Expression: '*' must follow '+'");
                      setCalcValue((prev) => prev.slice(0, -1));
                      return
                    }
                  }
          }

        }
        setCalcError("");
    }


    const res = checkValidExpression(calcValue);
    console.log(res);
    
  }  

  const handleSendCustomerBill = async () => {
        let time = new Date().toLocaleString({time: 'long'});
    let userData = {...groupedValue, totalAmount: result, quantity: groupedValue.length, time};
    const data = {
      bill : userData,
      customerData,
      // totalAmount: result,
      // quantity: groupedValue.length
    }
    try {
      axios.post('http://localhost:3000/send-bill', {data}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
      })
    } catch (error) {
      console.log(error);
    }
  }
console.log(customersNameAndPhNo);

  return (
    <>
    <div className={styles.calcContainer}>
      <div className={styles.calculator}>
            {calcError.length > 0 && <h5 className={styles.error}>{calcError}</h5>}

  <div className={styles.output}>
<input
  ref={calcInputRef}
  value={calcValue}
  onChange={(e) => checkItemNameExist(e.target.value)}
  className={styles.result}
/>
  </div>
  <div className={styles.calcBtns}>
    <button onClick={() => setCalcValue((prev) => prev + "1")} className={styles.btn}>1</button>
    <button onClick={() => setCalcValue((prev) => prev + "2")} className={styles.btn}>2</button>
    <button onClick={() => setCalcValue((prev) => prev + "3")} className={styles.btn}>3</button>
    <button onClick={() => setCalcValue((prev) => prev + "+")} className={styles.btn}>+</button>
    <button onClick={() => setCalcValue((prev) => prev + "4")} className={styles.btn}>4</button>
    <button onClick={() => setCalcValue((prev) => prev + "5")} className={styles.btn}>5</button>
    <button onClick={() => setCalcValue((prev) => prev + "6")} className={styles.btn}>6</button>
    <button onClick={() => setCalcValue((prev) => prev + "-")} className={styles.btn}>-</button>
    <button onClick={() => setCalcValue((prev) => prev + "7")} className={styles.btn}>7</button>
    <button onClick={() => setCalcValue((prev) => prev + "8")} className={styles.btn}>8</button>
    <button onClick={() => setCalcValue((prev) => prev + "9")} className={styles.btn}>9</button>
    <button onClick={() => setCalcValue((prev) => prev + "*")} className={styles.btn}>*</button>
    <button onClick={() => setCalcValue("")} className={styles.bgRed}>C</button>
    <button onClick={() => setCalcValue((prev) => prev + "0")} className={styles.btn}>0</button>
    <button onClick={() => setCalcValue((prev) => prev + "=")} className={styles.bgGreen}>=</button>
    <button onClick={() => setCalcValue((prev) => prev + "/")} className={styles.btn}>/</button>
  </div>
</div>

<br /><br />
{/*----------------------------------------- Table---------------------------------- */}
<div className={styles.tableContainer}>
<table className={styles.itemsTable}>
  <thead>
    <tr className={styles.tableHeaderRow}>
      <th className={styles.tableHeaderCell}>No.</th>
      <th className={styles.tableHeaderCell}>Items</th>
      {/* <th className={styles.tableHeaderCell}>Rate/Quantity</th> */}
      <th className={styles.tableHeaderCell}>Price</th>
      <th className={styles.tableHeaderCell}>Quantity</th>
      <th className={styles.tableHeaderCell}>Amount</th>
    </tr>
  </thead>
  <tbody className={styles.tableBody}>
    {groupedValue.map((g) => (
      <tr className={styles.tableRow} key={g.id}>
        <td className={styles.tableCell}>{g.id}.
           {redLight.id === g.id && (
            <span style={{ color: "red", marginLeft: "5px" }}>⚠️</span>
           )}
           </td>
        <td className={styles.tableCell}>
                      {g.confirmed ? (
              <>
<input
  key={g.id}
  type="text"
  placeholder="Enter item name"
  ref={(el) => (inputRefs.current[g.id] = el)}
  value={g.name || ""}
  onChange={(e) => handleNameChange(g.id, e.target.value)}
onKeyDown={(e) => {
  if (e.key === "Enter") {
    if (!g.name || g.name.trim() === "") {
      e.preventDefault();
      alert("Please enter item name before continuing");
    } else {
      calcInputRef.current?.focus();
            setRedLight({});
    }
  }
}}

  className={styles.nameInput}
  style={{ padding: "6px 8px" }}
  required
/>

              </>
            ) : (
              <div style={{ color: "#999" }}>typing…</div>
            )}
        </td>
        {/* <td className={styles.tableCell}>{g.expr}</td> */}
        <td className={styles.tableCell}>{g.price}</td>
        <td className={styles.tableCell}>{g.quantity}</td>
        <td className={styles.tableCell}>${g.amount}</td>
      </tr>
    ))}
    <tr style={{ backgroundColor: "#ebe3e3ff" }} className={styles.tableRow}>
              <td className={styles.tableCell}><b>Total Amount:</b></td>
              <td className={styles.tableCell}></td>
              <td className={styles.tableCell}></td>
              <td className={styles.tableCell}><b>Total <br />Quantity:{groupedValue.length}</b> </td>
              <td className={styles.tableCell}><b>Total:${result}</b> </td>
    </tr>
  </tbody>
</table>
{/* <div>{calcValue},{groupedValue}</div> */}
  <div className={styles.customerInfo}>
  <span>
    <label style={{color: "black"}} htmlFor="">Name:</label>
  <input value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})} className={styles.customerInput} type="text" placeholder="Name" />
  {customerData.name.length > 0 && (
    <div>
      <div className={styles.searchContainer}>
        {searchName?.map((name, index) => (
        <input key={index} value={name} onClick={() => setSelectedNameAndPhNo({...selectedNameAndPhNo, name: name})} type="text" readOnly />
        ))} 
      </div>
    </div>
  )}

  </span>
  <span>
    <label style={{color: "black"}} htmlFor="">Ph No:</label>
  <input value={customerData.phoneNo}  onChange={(e) => setCustomerData({...customerData, phoneNo: e.target.value})} className={styles.customerInput} type="number" placeholder="Ph No" />
      {customerData.phoneNo.length > 0 && (
      <div className={styles.searchContainer}>
        {searchNumber?.map((number, index) => (
        <input key={index} value={number} onClick={() => setSelectedNameAndPhNo({...selectedNameAndPhNo, phNo: number})} type="text" readOnly />
        ))} 
      </div>
  )}
  </span>
    <span>
    {/* <label style={{color: "black"}} htmlFor="">Bill No:</label> */}
    {/* <button onClick={() => handleSendCustomerBill()}>Generate</button> */}
    {/* <input className={styles.customerInput} type="number" placeholder="Bill No" /> */}
  </span>
</div>
    <button onClick={() => handleSendCustomerBill()}>Generate</button>

</div>
</div>

 </>
  )
}

export default Home;
