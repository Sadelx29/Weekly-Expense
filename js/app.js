//variables and selectors

const form = document.querySelector('#agregar-gasto');
const costList = document.querySelector('#gastos ul');



// events
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', requestQuote);
    form.addEventListener('submit',addExpenses);
    
}


//class

class  Budget {
    //storage of expenses
    constructor(budget){
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }

    newExpense(expense){
        this.expenses = [...this.expenses,expense]
        this.calculateRemaining()
    }
    //calculate remaning for each expense
    calculateRemaining(){
        const spent = this.expenses.reduce((budget, expense) => budget + expense.price, 0);
        this.remaining = this.budget - spent
        
        console.log(spent)
        
    }

}

     

class UI {

    insertBudget(quantity){
        const {budget,remaining} = quantity;
        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = remaining;


    }

    printAlert(message, type){
        //create  div of message 
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center','alert');

        if (type === 'error'){
            divMessage.classList.add('alert-danger');

        }else{
            divMessage.classList.add('alert-success')
        }

        //message error
        divMessage.textContent = message

        //insert in HTML

        document.querySelector('.primario').insertBefore(divMessage,form);

        //delete notification 
        setTimeout(() => {
            divMessage.remove()
        }, 3000);


    }
    addExpenseList(expense){

        this.clearHTML()
        
        
        expense.forEach(expense => {
            const {price,request,id} = expense
            


            //create LI

            const newExpense = document.createElement('li')
            newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';
            newExpense.dataset.id = id;

          

            //add html in expense

            newExpense.innerHTML = `${request} <span class="badge badge-primary badge-pill">$  ${price}</span>`

            //create button
            const btnDelete = document.createElement('button')
            btnDelete.classList.add('btn','btn-danger','delete-expense')
            btnDelete.innerHTML = 'Delete &times'

            
            
            newExpense.appendChild(btnDelete)


            //add html
            costList.appendChild(newExpense)
        });
    }

    //remove the first object
    clearHTML(){
        while(costList.firstChild){
            costList.removeChild(costList.firstChild)
        }
    }

    updateRemaining(remaining){
        document.querySelector('#restante').textContent = remaining;

    }

    comprobateExpense(budgetObj){
        const {budget, remaining} = budgetObj

        const remainingDiv = document.querySelector('.restante')

        
        //comprobate 25%
        if( (budget / 4) >= remaining ){
            remainingDiv.classList.remove('alert-success','alert-warning')
            remainingDiv.classList.add('alert-danger')
        }else if ((budget / 2) >= remaining){
            remainingDiv.classList.remove('alert-success')
            remainingDiv.classList.add('alert-warning')

        }


        if( remaining <= 0){
            ui.printAlert('Your budget is not enough','error')
            form.querySelector('button[type="submit"]').disabled = true
        }
        

    }

    


}


const ui = new UI();

let budget;


//functions

function requestQuote(){
    const quoteUser = prompt("What's your budget?");

    //validate budget
    if (quoteUser === '' || quoteUser === null || isNaN(quoteUser) || quoteUser <= 0){
        window.location.reload();
    }
    

    budget = new Budget(quoteUser);
    remaining = new Budget(quoteUser);
    ui.insertBudget(budget);

    

}

function addExpenses(e){
    e.preventDefault()

        //add expenses
    const  request = document.querySelector('#gasto').value
    const  price = Number(document.querySelector('#cantidad').value)

    //validate fields of expenses
    if(request === '' || price <= 0){
        ui.printAlert('All fields are necesary','error');
    } else if(price <= 0 || isNaN(price)){
        ui.printAlert('Price invalid','error')

    }

    

        //create an expense with ID
    const expense = {request,price, id:Date.now()};


    budget.newExpense(expense);
   

    ui.printAlert('Expense added succesfull');


    //print expenses
    const {expenses, remaining} = budget;
    ui.addExpenseList(expenses)

    ui.updateRemaining(remaining)

    ui.comprobateExpense(budget)

    //reset form
    form.reset()




}