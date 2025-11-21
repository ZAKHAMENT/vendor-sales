import React, {useEffect, useState, useRef} from "react";
import styles from './Home.module.css'
function Home() {
  const [calcValue, setCalcValue] = useState("");
  const [calcError, setCalcError] = useState("");
  const [groupedValue, setGroupedValue] = useState([]);
  const [result, setResult] = useState(null);
  const [redLight, setRedLight] = useState({});
  const inputRefs = useRef({});
const calcInputRef = useRef(null);

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
    const prev = tokens[i - 1];
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
  console.log(calcValue);
  
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
    <label htmlFor="">Name</label>
  <input className={styles.customerInput} type="text" placeholder="Name" />
  </span>
  <span>
    <label htmlFor="">Ph No:</label>
  <input className={styles.customerInput} type="number" placeholder="Ph No" />
  </span>
    <span>
    <label htmlFor="">Bill No:</label>
    <input className={styles.customerInput} type="number" placeholder="Bill No" />
  </span>
</div>
</div>
</div>
    </>
  )
}

export default Home;
