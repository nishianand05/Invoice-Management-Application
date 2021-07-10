const table = document.querySelector(".main-table");
const pgRight = document.querySelector(".paginationRightBtn");
const pgLeft = document.querySelector(".paginationLeftBtn");

fetch("/H2HBABBA2585/fetch")
.then(function(res){
  return res.json();
})
.then(function(d){

    var data = d;

    var state = {
      querySet: data,
      page: 1,
      rows: 11,
      pages: Math.ceil(data.length/11)
    }
    
    init();
    
    function init(){
        addTableHeaders();
        addTableData();
        checkboxSelection();
        checkDueDate();
        checkBoxSelected();
    }

    // Table functions and pagination

    function pagination(querySet, page, rows){
        var trimStart = (page-1)*rows
        var trimEnd = trimStart + rows
    
        var trimmedData = querySet.slice(trimStart, trimEnd)
    
        var pages = Math.ceil(querySet.length / rows)

        return {
        'querySet': trimmedData,
        'pages': pages
        }
    }
    
    function addTableHeaders() {
        
        let tbHeaders = ["Customer Name", 
                        "Customer #",
                        "Invoice #",
                        "Invoice Amount",
                        "Due Date",
                        "Predicted Payment Date",
                        "Notes"]

        let tbhead = "<thead><tr><th><input type='checkbox' class='mainCheckBox'/></th>";

        let tbbody = "<tbody>"

        tbHeaders.forEach((h) => {
            let s = "<th>" + h + "</th>"
            tbhead += s
        })

        tbhead += "</tr></thead>"
        table.innerHTML = tbhead;
    }

    function addTableData(){
        var data = pagination(state.querySet, state.page, state.rows)
        var list = data.querySet

        let keys = ["name_customer", "cust_number", "invoice_id", "total_open_amount", "due_in_date", "predicted_payment_date", "notes"];
        let tbody = "<tbody>"
        
        list.forEach((row) => {
        tbody+= "<tr><td><input type='checkbox' class='dataCheckBox' /></td>";
        keys.forEach((key)=>{
            var value = row[key];
            if(!(value)) {
            value = '--'
            }
            tbody += `<td class="${key}">` + value + '</td>';
        })
        tbody += "</tr>"
        })
        
        tbody += "</tbody>";
        table.innerHTML += tbody;

        checkboxSelection();
        checkBoxSelected();
        
    }

    function pageInc(){
    if(state.page < state.pages){
        state.page+=1
        pgRight.classList.remove("btn-disabled")
        pgLeft.classList.remove("btn-disabled")
    } else {
        pgRight.classList.add("btn-disabled")
    }
    table.innerHTML = ""
    addTableHeaders()
    addTableData()
    checkboxSelection()
    checkDueDate();
    }

    function pageDec(){
    if(state.page > 1){
        state.page-=1
        pgRight.classList.remove("btn-disabled")
        pgLeft.classList.remove("btn-disabled")
    } else {
        pgLeft.classList.add("btn-disabled")
    }
    table.innerHTML = ""
    addTableHeaders()
    addTableData()
    checkboxSelection()
    checkDueDate();
    }

    pgRight.addEventListener("click", pageInc)
    pgLeft.addEventListener("click", pageDec)


    // CheckBox functions

    var selectedRows = [];

    function disableEditDelete(){
        var editBtn = document.querySelector(".editBtn");
        var deleteBtn = document.querySelector(".deleteBtn");
        if(editBtn.disabled == true || deleteBtn.disabled == true){
          editBtn.disabled = false;
          deleteBtn.disabled = false;
        }
    }
      
    function enableEditDelete(){
        var editBtn = document.querySelector(".editBtn");
        var deleteBtn = document.querySelector(".deleteBtn");
        if(editBtn.disabled == false || deleteBtn.disabled == false){
        editBtn.disabled = true;
        deleteBtn.disabled = true;
        }
    }
      
    function checkboxSelection(){
        const mainCheckBox = document.querySelector(".mainCheckBox")
        const dataCheckBoxes = document.querySelectorAll(".dataCheckBox")
        
        mainCheckBox.addEventListener("click", function(){
            if(mainCheckBox.checked == true){
                disableEditDelete();
                
                dataCheckBoxes.forEach((row)=> {
                    row.checked = true;
                })
            } else {
                enableEditDelete();
                
                dataCheckBoxes.forEach((row)=> {
                    row.checked = false;  
                })
            }
        });
    }

    function checkBoxSelected(){
        
        var dataCheckboxes = document.querySelectorAll(".dataCheckBox");
        
        dataCheckboxes.forEach(function(ele){
            ele.addEventListener("change", function(){
                if(this.checked){
                    selectedRows.push(ele.parentElement.parentElement);
                    disableEditDelete();
                } else {
                    enableEditDelete();
                }
            });
        });
    }
      

    // Color due dates red if delayed

    function checkDueDate(){
        var today = new Date(Date.now());
        var dueDates = document.querySelectorAll(".due_in_date");
        
        dueDates.forEach((date) => {
            var dd = new Date(date.textContent);
            if(dd - today < 1){
                date.style.color = "#FF5E5E";
            }
        });
    }
      

    // SnackBar function

    const snackbar = (content) => {
        var x = document.querySelector(".snackbar");
        x.textContent = content
        x.classList.remove("hide")
        x.classList.add("show")
        setTimeout(function(){
            x.classList.add("hide")
            x.classList.remove("show")
        }, 3000);
    }


    // Add data

    const add = () => {

        const name_customer =  document.getElementById("customerNameInp").value;
        const cust_number =  document.getElementById("customerNumberInp").value;
        const invoice_id =  document.getElementById("invoiceNoInp").value;
        const total_open_amount =  document.getElementById("invoiceAmountInp").value;
        const due_in_date = document.getElementById("dueDateInp").value;
        const notes =   document.getElementById("notesInp").value;


        if(name_customer == "" || cust_number == "" || invoice_id == "" || total_open_amount == "" || due_in_date == ""){
          snackbar("Mandatory fields can't be empty");
        } else {
            fetch(`/H2HBABBA2585/add?name_customer=${name_customer}&cust_number=${cust_number}&invoice_id=${invoice_id}&total_open_amount=${total_open_amount}&due_in_date=${due_in_date}&notes=${notes}`,
            { 
                method: 'POST' 
            })
            .then(function(){
                init();
                snackbar("Data added succesfully");
            })
        }
    }
    
    const addSaveBtn = document.querySelector(".addSaveBtn");
    addSaveBtn.addEventListener("click", add);

    // Edit data

    const edit = () => {
        
        let total_open_amount = document.querySelector(".editModalForm #invoiceInput").value;
        let notes = document.querySelector(".editModalForm #editNotes").value;
       
        selectedRows.forEach((ele)=>{
            
            let invoice_id =  ele.querySelector(".invoice_id").textContent;
            let toa =  ele.querySelector(".total_open_amount").textContent;
            let n =  ele.querySelector(".notes").textContent;
            
            if(total_open_amount == ""){
                total_open_amount = toa;
            }
            if(notes == ""){
                notes = n;
            }
       
         
           fetch(`/H2HBABBA2585/edit?invoice_id=${invoice_id}&total_open_amount=${total_open_amount}&notes=${notes}`,
            {
               method: 'POST'
            }).then(function(){
                
                selectedRows = [];

                disableEditDelete();
                init();
                snackbar("Data updated succesfully");
            });
        });
    }
       
    const editSaveBtn = document.querySelector(".editSaveBtn");
    editSaveBtn.addEventListener("click", edit);


    // Delete data

    const deleteData = () => {

        selectedRows.forEach((ele) => {

           let invoice_id =  ele.querySelector(".invoice_id").textContent;
      
           fetch(`/H2HBABBA2585/delete?invoice_id=${invoice_id}`,
           {
               method: 'POST'
            }).then(function(){
                
                selectedRows = [];
                disableEditDelete();
                init();
                snackbar("Data deleted succesfully");
            });
           
        });
    }
      
    const ModalDeleteBtn = document.querySelector(".ModalDeleteBtn");
    ModalDeleteBtn.addEventListener("click", deleteData);

    // Edit modal reset
    
    const resetEditModal = () => {
        document.querySelector(".editModalForm #invoiceInput").value = "";
        document.querySelector(".editModalForm #editNotes").value = "";
    }
    
    const editModalResetBtn = document.querySelector(".editModal .resetBtn");
    editModalResetBtn.addEventListener("click", resetEditModal);
    
    // Add modal clear 
    const clearAddModal = () => {
        document.getElementById("customerNameInp").value = "";
        document.getElementById("customerNumberInp").value = "";
        document.getElementById("invoiceNoInp").value = "";
        document.getElementById("invoiceAmountInp").value = "";
        document.getElementById("dueDateInp").value = "";
        document.getElementById("notesInp").value = "";
    }

    const addModalClearBtn = document.querySelector(".addModal .clearBtn");
    addModalClearBtn.addEventListener("click", clearAddModal);
    
    // Cancel buttons - All modals
    
    const addModalCancelBtn = document.querySelector(".addModal .cancelBtn");
    const editModalCancelBtn = document.querySelector(".editModal .cancelBtn");
    const deleteModalCancelBtn = document.querySelector(".deleteModal .cancelBtn");

    addModalCancelBtn.addEventListener("click", reloadPage);
    editModalCancelBtn.addEventListener("click", reloadPage);
    deleteModalCancelBtn.addEventListener("click", reloadPage);

    function reloadPage(){
    location.reload();
    }

})
.catch(function(){
    console.log("Error! Could not load data");
})