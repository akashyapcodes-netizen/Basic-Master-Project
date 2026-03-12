    // Data

    let task = [];
    //let score = 0;
    let idCount = 0;
    let editingId = null;
    let currentFilter = "all";


            // Selectors

    const taskList = document.querySelector("#taskList");
    const taskInput = document.querySelector("#taskInput");
    const scoreValue = document.querySelector(".scoreValue");
    const levelValue = document.querySelector(".levelValue");
    const progressBar = document.querySelector(".pro-bar");
    const allBtn = document.querySelector(".allBtn");
    const compBtn = document.querySelector(".comp-Btn");
    const pendingBtn = document.querySelector(".pending-Btn");
    const addBtn = document.querySelector(".btn");
    const clearBtn = document.querySelector(".clear-Btn");
    const totalCount = document.querySelector(".totalcount");
    const compCount = document.querySelector(".comp-count");
    const pendingCount = document.querySelector(".pending-count");
    const saveBtn = document.querySelector(".save-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const themBtn = document.querySelector(".themBtn");
    const prioritySelect = document.querySelector("#priSelect");
    const dueDate = document.querySelector("#dueDate");
    const searchInput = document.querySelector(".searchInput");
    const importantBtn = document.querySelector(".important");
    importantBtnWithStar = document.querySelector(".importantStar")

    let searchText = "";
    searchInput.addEventListener("input",function(){
        searchText = this.value.toLowerCase().trim();
        renderTask();
    });




            // Load From LocalStorage


                let savedTask = localStorage.getItem("myTask");

                if(savedTask){
                    task = JSON.parse(savedTask);

                    task.forEach(function(item){
                        if(item.id > idCount){
                            idCount = item.id;
                        }
                    
                    });
                }
            //Util Function...........


                function saveDate(){
                    localStorage.setItem("myTask",JSON.stringify(task));
                }
                function updateLevel(currentScore){
                    let oldLevel = levelValue.innerText;
                    let newLevel = "";
                    if(currentScore <= 40){
                    newLevel = "Begginer😂";
                    }else if(currentScore <= 90){
                        newLevel = " intermidiate😋";
                    }else{
                        newLevel = "Pro🤩";
                    }
                    levelValue.innerText = newLevel
                    if(oldLevel !== newLevel){
                        levelValue.style.transform = "scale(1.3)";
                        levelValue.style.transition = "0.3s";
                        setTimeout(() => {
                            levelValue.style.transform = "scale(1)";
                        }, 300);
                    }
            }
                function updateProgress(currentScore){
                    let progress = currentScore % 100;
                    progressBar.style.width = progress + "%";
                }
                

                function upadateTaskState(){
                    let total = task.length;
                    let completed = task.filter(item => item.completed).length;
                    let pending = total - completed;
                    importantBtnWithStar.innerText = task.filter(t => t.important).length

                    totalCount.innerText = `Total  ${total}`;
                    compCount.innerText = `Completed ${completed}`;
                    pendingCount.innerText = `Pending ${pending}`;

                }

                function sortTasks(){
                    task.sort(function(a, b){
                            
                        if(a.important !== b.important){
                            return b.important - a.important;

                        }
                        if(a.completed !== b.completed){
                            return a.completed - b.completed;
                        }
                    function getPriorityValue(priority){
                            if(priority === "High")
                                return 3;
                            
                            if(priority === "Medium")
                                return 2;
                            
                                return 1;
                                            
                        }
                        // if(a.completed !== b.completed){
                        //     return a.completed - b.completed;
                        // }
                    
                        
                    return   getPriorityValue(b.priority) - getPriorityValue(a.priority);
                            
                        

                    });
                }
                    
                //Render Funtion...........

                function renderTask(){


                
                if(taskList){
                    taskList.innerHTML = "";
                }
                task.forEach(function(taskObject){
                    if(currentFilter === "completed" && !taskObject.completed){
                        return;
                    }
                    if(currentFilter === "pending" && taskObject.completed){
                        return;
                    }
                    if(currentFilter === "important"  && !taskObject.important){
                        return;
                        
                        
                    }
                    


                    // if(!taskObject.text.toLowerCase().includes(searchText)){
                    //     return;
                    // }

                    const keywords = searchText 
                    .toLowerCase()
                    .trim()
                    .split(/\s+/)
                    .filter(word => word !== "");

                    for(let word of keywords){
                        const textMatch = taskObject.text.toLowerCase().includes(word);
                        const priortyMatch = taskObject.priority.toLowerCase().includes(word);
                        if(!textMatch && !priortyMatch){
                            return;
                        }
                    }

                    let li = document.createElement("li");
                
                    li.dataset.id = taskObject.id;

                    let span = document.createElement("span");
                    
                    span.innerText = taskObject.text + " [" + taskObject.priority +"] ";
                    li.classList.add("fade-in");

                    //Color Coding 

                    if(taskObject.priority ==="High"){
                        span.style.color ="red";

                    }else if(taskObject.priority === "Medium"){
                        span.style.color = "orange";
                    }else{
                        span.style.color = "green";
                    }
                    if(taskObject.dueDate){
                        const today = new Date().toISOString().split("T")[0];
                        if(taskObject.dueDate < today && !taskObject.completed){
                            li.style.backgroundColor = "#ffcccc"
                        }
                    }
                    let starBtn = document.createElement("button");
                    starBtn.innerText = taskObject.important ? "⭐" : "🌟";
                    starBtn.classList.add("star-btn");

                // li.innerText = taskObject.text;
                    if(taskObject.completed){
                        li.style.textDecoration = "line-through";
                    }

                    let completeBtn = document.createElement("button");
                    completeBtn.innerText = "complete ✔️";
                    
                    completeBtn.classList.add("complete-btn");
                        
                    
                    let deleteBtn = document.createElement("button");
                    deleteBtn.innerText = "Delete ❌";
                    
                    deleteBtn.classList.add("delete-btn");

                                    // Edit Button

                let editBtn = document.createElement("button");

                            editBtn.innerText = "Edit ✏️"

                            editBtn.classList.add("edit-btn")

                            li.appendChild(span);
                            li.appendChild(completeBtn);
                            li.appendChild(editBtn);
                            li.appendChild(deleteBtn);
                            li.appendChild(starBtn);

                            taskList.appendChild(li);
                });

                            upadateTaskState();


            }
            function refreshApp(){
                saveDate();
                sortTasks();
                const currentScore = calculateScore();
                scoreValue.innerText = currentScore;
                updateLevel(currentScore);
                updateProgress(currentScore);
                checkAchivement(currentScore);
                renderTask();
                
            }


            addBtn.addEventListener("click",function(){
                let taskText = taskInput.value.trim();
                if(taskText === ""){
                    alert("Enter Something");
                    return;             
                    
                }
                //Priority Selcet 

                let priority = prioritySelect.value;
                let point = 0;
                if(prioritySelect.value === "High"){
                    point +=10;
                }else if(prioritySelect.value === "Medium"){
                    point += 5;
                }else{
                    point += 2;
                }
                idCount++;

                task.push({
                    id : idCount,
                    text : taskText,
                    completed : false,
                    priority : priority,
                    point : point,
                    dueDate : dueDate.value,
                    important : false,
                    recurring : "none",

                });
            
                dueDate.value = "";
                

                
                
                saveDate();
                taskInput.value = "";
                refreshApp();
            }); 

            //Filter Buttons

            taskInput.addEventListener("keypress",function(e){
            if(e.key === "Enter"){
                if(editingId){
                    saveBtn.click();
                }else{
                    addBtn.click();
                }
            }
            });

            allBtn.addEventListener("click",function(){
                currentFilter = "all";
                renderTask();

            });
            compBtn.addEventListener("click",function(){
                currentFilter = "completed";
                renderTask();
            });
            pendingBtn.addEventListener("click",function(){
                currentFilter = "pending";
                renderTask();
            });
            importantBtn.addEventListener("click",function(){
                currentFilter = "important";              
                renderTask();
            });

            taskList.addEventListener("click",function(e){
                const li = e.target.closest("li");
                if(!li){
                    return;
                }
                const id = Number(li.dataset.id);
                const taskObject =  task.find(items => items.id === id);

                if(e.target.classList.contains("star-btn")){
                    taskObject.important = !taskObject.important;
                    refreshApp();
                    return;
                }

                

            //  Complete

                if(e.target.classList.contains("complete-btn")){
                    if(!taskObject) return;
                    if(!taskObject.completed && taskObject.recurring !== "none"){

                        let newDate = new Date(taskObject.dueDate) ? new Date(taskObject.dueDate) : new Date()


                        if(taskObject.recurring === "daily"){
                            newDate.setDate(newDate.getDate() + 1 );
                        }
                        if(taskObject.recurring ==="weekly"){
                            newDate.setDate(newDate.getDate() + 7)

                            }
                            idCount++;
                            task.push({
                                ...taskObject,
                                id : idCount,
                                completed : false,
                                dueDate:
                                newDate.toISOString().split("T")[0]
                            });
                        }
                    

                        e.target.disabled = true;
                            // taskObject.completed = !taskObject.completed;
                            li.classList.add("complete-animate");
                            setTimeout(() => {
                                taskObject.completed = !taskObject.completed;
                                refreshApp();
                            }, 200);
        
                return;
                }
                
            if(e.target.classList.contains("delete-btn")){
                task = task.filter(item => item.id !== id);
                refreshApp();
                
                }
                
                if(e.target.classList.contains("edit-btn")){
                    taskInput.value = taskObject.text;
                    editingId = id;
                    prioritySelect.value = taskObject.priority;
                    dueDate.value = taskObject.dueDate || "";
                    
                    addBtn.style.display = "none";
                    saveBtn.style.display = "inline-block";
                    cancelBtn.style.display = "inline-block";
                    
                }

                });

                // Delete 

            
                // Edit Mode Start

        // });

            saveBtn.addEventListener("click",function(){
                let newTaxt = taskInput.value.trim();
                if(newTaxt ===""){
                    return;

                }   
                let taskObject = task.find(item => item.id === editingId);
                taskObject.text = newTaxt;
                taskObject.priority = prioritySelect.value;

                editingId = null;
                taskInput.value = "";

                addBtn.style.display = "inline-block";
                saveBtn.style.display = "none";
                cancelBtn.style.display = "none";

                refreshApp();
            });
            
            
            // Cancel Button

            cancelBtn.addEventListener("click",function(){
                editingId = null;
                taskInput.value = "";
                addBtn.style.display  = "inline-block";
                saveBtn.style.display = "none";
                cancelBtn.style.display = "none";
            });

            // Clear all

            clearBtn.addEventListener("click",function(){
                let confirmClear = confirm("Are you sure want to clear all Task");
                if(confirmClear){
                    task = [];
                    //score = 0;
                    refreshApp();
                }
            });

            let savedTheme = localStorage.getItem("theme");

            if(savedTheme === "dark"){
                document.body.classList.add("dark-mode");
                themBtn.innerText  = "Light Mode";
                
                
            }

            themBtn.addEventListener("click", function(){
                document.body.classList.toggle("dark-mode");
                if(document.body.classList.contains("dark-mode")){
                    localStorage.setItem("theme","dark");
                    themBtn.innerText = "Light Mode☀️";
                }else{
                    localStorage.setItem("theme","light");
                    themBtn.innerText = "Dark Mode🌑";
                }
            });
            function calculateScore(){
                return task.filter(item =>item.completed)
                .reduce((total,item) => total + item.point ,0);
            }
            function checkAchivement(currentScore){
                if(currentScore >= 100){
                    alert("Achivement unlocked 100 Point !");
                }
            }
            levelValue.classList.add("pop");
            setTimeout(() => {
                levelValue.classList.remove("pop");
            }, 300);
            refreshApp()






                                

                