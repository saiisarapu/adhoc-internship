const API = "http://localhost:5000";

let chart;

document
.getElementById("transactionForm")
.addEventListener("submit", addTransaction);

async function addTransaction(e){

    e.preventDefault();

    const transaction = {
        title: document.getElementById("title").value,
        amount: Number(
            document.getElementById("amount").value
        ),
        type: document.getElementById("type").value
    };

    await fetch(`${API}/transactions`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(transaction)
    });

    e.target.reset();

    loadTransactions();
}

async function loadTransactions(){

    const start =
    document.getElementById("startDate").value;

    const end =
    document.getElementById("endDate").value;

    let url = `${API}/transactions`;

    if(start && end){
        url +=
        `?startDate=${start}&endDate=${end}`;
    }

    const res = await fetch(url);

    const transactions = await res.json();

    renderTransactions(transactions);

    updateSummary(transactions);

    updateChart(transactions);
}

function renderTransactions(data){

    const history =
    document.getElementById("history");

    history.innerHTML = "";

    data.forEach(item=>{

        const li =
        document.createElement("li");

        li.innerHTML = `
            ${item.title}
            ₹${item.amount}
            (${item.type})
            ${new Date(item.date)
            .toLocaleDateString()}
            <button onclick="deleteTransaction('${item._id}')">
                Delete
            </button>
        `;

        history.appendChild(li);
    });
}

function updateSummary(data){

    let income = 0;
    let expense = 0;

    data.forEach(item=>{

        if(item.type === "income"){
            income += item.amount;
        }else{
            expense += item.amount;
        }
    });

    document.getElementById("income")
        .textContent = `₹${income}`;

    document.getElementById("expense")
        .textContent = `₹${expense}`;

    document.getElementById("balance")
        .textContent = `₹${income-expense}`;
}

function updateChart(data){

    let income = 0;
    let expense = 0;

    data.forEach(item=>{

        if(item.type==="income"){
            income += item.amount;
        }else{
            expense += item.amount;
        }
    });

    const ctx =
    document.getElementById("budgetChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:"doughnut",

        data:{
            labels:[
                "Income",
                "Expense"
            ],

            datasets:[{
                data:[
                    income,
                    expense
                ],

                backgroundColor:[
                    "#16a34a",
                    "#dc2626"
                ]
            }]
        }
    });
}

async function deleteTransaction(id){

    await fetch(
        `${API}/transactions/${id}`,
        {
            method:"DELETE"
        }
    );

    loadTransactions();
}

loadTransactions();