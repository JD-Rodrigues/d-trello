onresize = () => setEventToMobileMenu()

const getData = async () => {

  //It get the boards and tasks from database, filtering by user credential
  const credential = await JSON.parse(localStorage.getItem('credential'))
  if (credential) {
    const userCode = credential.user_code
    try {
      const dataBoards = await readData('boards', credential.user_code )
      const dataTasks = await readData('tasks', credential.user_code )

      //It sorts boards and tasks by value of order column
      dataBoards.sort((a,b)=>{
      switch (a.board_order > b.board_order) {   
        case true:
          return 1;
          break;
        case false:
          return -1;
          break
        default:
          break;
      }
      })
      
      dataTasks.sort((a,b)=>{
        switch (a.task_order > b.task_order) {   
          case true:
            return 1;
            break;
          case false:
            return -1;
            break
          default:
            break;
        }
      })

      //It maps dataBoards and create a new object array(boards) containing the required info to jKanban create boards in the DOM. So, it calls the instance of Jkanban, passing this new array, dataTasks and the user code as arguments.
      let boards = []
      let tasks = []
      for (let board in await dataBoards) {
        boards.push(
          {
            id: `_todo${dataBoards[board].id}`,
            idNumber: dataBoards[board].id,
            title: dataBoards[board].title,
            class: dataBoards[board].class,
            dragTo: [],
          }
        )
      }
      document.querySelector('#dTrello').innerHTML=""

      InstanceKanban(boards, dataTasks, userCode)
    } catch (error) {
      document.querySelector('#dTrello').innerHTML = `<dialog open="true" class="nodata-warning"><p>Desculpe... Tivemos um problema com nossa base de dados. Volte dentro de alguns instantes.</p></dialog>`
    }
  }
  
}

//It sets an click event listener in the hamburquer button to open the mobile menu, if screensize is less then 700px.
const setEventToMobileMenu = () => {
  if(screen.width < 700) {
    document.querySelector('.hamburguer').addEventListener('click', ()=> document.querySelector('.user').classList.add('menu-mobile-show'))
    document.querySelector('.back').addEventListener('click', ()=> document.querySelector('.user').classList.remove('menu-mobile-show'))
  }
}

// Sets the container  width according to number of boards
const setContainerWidth = () => {
  const containerLenght = document.querySelectorAll('.kanban-board').length

  document.querySelector('.kanban-container').style.width = `${containerLenght * 300 + 15 * (containerLenght - 1)}px`
}

// Set display "none" for all inputs in the boards' title and restore the initial condition to the titles: display "inline".
const hideAllInputs = () => {
  document.querySelectorAll('.kanban-title-input').forEach(input => {
    input.style.display = 'none'
  })

  document.querySelectorAll('.kanban-title-board').forEach(input => {
    input.style.display = 'flex'
  })

  document.querySelectorAll('.title-edit-input').forEach(input => {
    input.style.display = 'none'
  })

  document.querySelectorAll('.card_title').forEach(input => {
    input.style.display = 'inline'
  })

  document.querySelectorAll('.form-group').forEach(input => {
    input.style.display = 'none'
  })
}

var InstanceKanban = async (allBoards, allTasks, userCode) => {

  // It receives a array of objects(boards), an array containing all tasks and a user code from the call in the getData function and instances JKanban passing a settings object as argument.
  var KanbanManager = await new jkanban({
    element: "#dTrello",
    gutter: "10px",
    // widthBoard: "500px",
    itemHandleOptions:{
      enabled: true,
    },
    click: function(el) {
      console.log("Trigger on all items click!");
    },
    context: function(el, e) {
      console.log("Trigger on all items right-click!");
    },

    // It defines what happen when the user drops a board and some position of the list of boards.
    dropBoard: function (el, target, source, sibling) {
      sibling ? target.insertBefore(el, sibling) : target.appendChild(el)
      const boardId = el.querySelector('.kanban-board').id
      const boardsHTMLCollection = source.children
      const boardsNodes = [...boardsHTMLCollection]

      boardsNodes.forEach((board,index) => {
        const id = board.querySelector('.kanban-board').id

        //It uses the board id and its new position relative to others boards to update database.
        updateBoardOrder(id,index)
      })
      
    },

    
    
// It sets what happen when a task card is dropped inside the same board or on another.
    dropEl: function(el, target, source, sibling){

      // Inserts the task element in the DOM at the position it was dropped in. 
      sibling ? target.insertBefore(el, sibling) : target.appendChild(el)

      // Updates the moved task's board_id (parent board)
      const boardTargetId = target.parentElement.id
      const taskId = el.dataset.eid
      const targetChildrenCollection = target.children
      const targetChildrenNodes = [...targetChildrenCollection]
      const sourceChildrenCollection = source.children
      const sourceChildrenNodes = [...sourceChildrenCollection]
            
      updateData('tasks', taskId, { board_id: boardTargetId })


      // Updates the tasks order in the source and target board at database.

      sourceChildrenNodes.forEach((task, index) => {
        const id = task.dataset.eid
        updateTaskOrder(id, index)
      })

      targetChildrenNodes.forEach((task, index) => {
        const id = task.dataset.eid
        updateTaskOrder(id, index)
      })
    },

    // This method is called when "Add new task" button is clicked.
    buttonClick: function(el, boardId) {
      hideAllInputs()
      // create a form to enter element
      var formItem = document.createElement("form");
      formItem.setAttribute("class", "itemform");
      formItem.innerHTML =
        `<div class="form-group"><textarea class="form-control" rows="2" autofocus></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary btn-xs pull-right">Submit</button><button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">Cancel</button></div>`;

      

      KanbanManager.addForm(boardId, formItem);
      
      // It sets a submit listen event that fires when the a new task is submited to creation.
      formItem.addEventListener("submit", function(e) {
        e.preventDefault();
        var text = e.target[0].value;
        const boardId = e.target.closest('.kanban-drag').closest('.kanban-board').id
        const childrenLength = e.target.parentElement.children.length
        
        if (text) {
          Swal.fire({
            title: 'Criando card em...',
            html: '<b></b> milliseconds.',
            timer: 1000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              const b = Swal.getHtmlContainer().querySelector('b')
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          })
          createData('tasks', {title: text, board_id:boardId, task_order:childrenLength, user_code: userCode}).then(formItem.parentNode.removeChild(formItem)).then(getData)
          
        } else {
          Swal.fire({
            title: 'Insira um nome para o novo card!',            
            confirmButtonColor:'#4caf50'
          })
        }
      });      
    },

    // "Add new task" button settings
    itemAddOptions: {
      enabled: true,
      content: '+ Nova tarefa',
      class: 'custom-button',
      footer: true
    },   
    
    // It contains the array of objects (boards) passed by the function getData() when called the function that instances JKanban InstanceKanban().
    boards:allBoards
    
  })

  // An input fields is inserted to the board header HTML to get edit values.
  document.querySelectorAll('.kanban-board-header').forEach(header=> header.innerHTML += `<input type="text" class="kanban-title-input" maxlength="30">`)

  setContainerWidth()
  

  addEventToEditName()

  
  //Iterate over each trash icon of the boards, adding a listener that fires a deletion function, passing the board's id as argument.
  

  addEventToRemoveBoards()

  // It renders each task inside its board, based on "board_id" column in the tasks table rows.
  const renderTasks = () => {
    allBoards.forEach(board => {
      allTasks.forEach(task => {
        if(board.idNumber === task.board_id) {
          KanbanManager.addElement(board.id, task)
        }
      })
    })

    addEventToEditName()
  }

  renderTasks()
  
  var allEle = KanbanManager.getBoardElements("_todo");
  
}


// It add events that call the edition functions when edition icon is clicked in boards and tasks.
const addEventToEditName = () => {
  document.querySelectorAll('.kanban-board-header .ph-pencil-fill').forEach(     pencilIcon=> pencilIcon.addEventListener('click',  showHideInputEditBoard)) 

  document.querySelectorAll('.kanban-item .ph-pencil-fill').forEach(pencilIcon=> pencilIcon.addEventListener('click', showHideInputEditTask )) 

}


// It fires when delete board icon is clicked
const addEventToRemoveBoards = () => {
  document.querySelectorAll('.kanban-title-board .ph-trash-fill').forEach(trashIcon=> trashIcon.addEventListener('click',(e)=>{
    e.stopPropagation()
    const board = trashIcon.closest('.kanban-title-board').closest('.kanban-board-header').closest('.kanban-board')

    const boardTasksLength = board.querySelector('.kanban-drag').children.length
    
    if(boardTasksLength > 0) {
      Swal.fire({
        title: 'Remova todas as tarefas do quadro antes de deletá-lo!',
        showCancelButton: false,
        confirmButtonColor: '#4caf50'
    }) 
    } else {
      
      Swal.fire({
        
        title: 'Gostaria realmente de deletar este quadro?',
        showCancelButton: true,
        confirmButtonColor: '#e52620',
        cancelButtonColor: '#2b3742'
    }).then(button=> {
      if(button.isConfirmed === true){
        board.parentElement.remove()
        deleteData('boards', board.id).then(getData)
        
    }
     } )
    }   
  }))
}

const filterCards = () => {
  const search = document.querySelector('#search').value.toLowerCase()
  const cards = document.querySelectorAll('.kanban-item')
  cards.forEach(card => {
    if(search){
      if(!card.querySelector('.card_title').innerHTML.toLowerCase().includes(search)) {
      card.classList.add('invisible')
      } else {
        card.classList.remove('invisible')
      }
    } else {
      card.classList.remove('invisible')
    }
  })
}

const nameNewBoard = () => {
  Swal.fire({
    title: 'Dê um nome ao novo quadro:',
    input: 'text',
    confirmButtonColor: '#4caf50',
    cancelButtonColor: '#2b3742',
    showCancelButton: true,
    inputValue:""
}).then(boardName=>{
    if(boardName.value === "") {
      nameNewBoard()
    } else {
      
        if(boardName.isConfirmed === true) {
          const container = document.querySelector('#dTrello')
          const credential = JSON.parse(localStorage.getItem('credential'))
          Swal.fire({
            title: 'Criando quadro em...',
            html: '<b></b> milliseconds.',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              const b = Swal.getHtmlContainer().querySelector('b')
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          })
          readData('boards', credential && credential.user_code).then(boards => {
            
            createData('boards',
            {
              title: `${boardName.value}<i class='ph-pencil-fill'><i class='ph-trash-fill'>`,
              class: 'default',
              board_order: boards.length + 1, 
              user_code: credential && credential.user_code
            }
          ).then(data => {
            getData().then(
              setTimeout(()=>{
              container.scrollLeft = container.scrollWidth
            },1000))
            
          }); 
          })        
          
          
          
        }
    }
  })         
}

//This function receive a card element as argument and opens a confirm modal. If the confirm button is clicked, the card will be removed.
const confirmRemoveCard = (cardId, target) => {
  
  Swal.fire({
    title: 'Gostaria realmente de deletar este card?',
    showCancelButton: true,
    confirmButtonColor: '#e52620',
    cancelButtonColor: '#2b3742'
}).then(button=> {
  if(button.isConfirmed === true){
    target.parentElement.remove()
    deleteData('tasks', cardId)
}
 } )
}

// Its called when a task is moved
const updateTaskOrder = (id, index) => {
  const order = index +1;
  updateData('tasks', id, {task_order: order});
}

// Its called when a board is moved
const updateBoardOrder = (id, index) => {
  const order = index + 1;
  updateData('boards', id, {board_order: order})
}



var showHideInputEditBoard = (e) => {
  e.stopPropagation()
  const title = e.target.closest('.kanban-title-board')
  const id = title.closest('.kanban-board-header').closest('.kanban-board').id
  const input = e.target.closest('.kanban-title-board').closest('.kanban-board-header').querySelector('.kanban-title-input')
  
  // It's called when edit icon is clicked on a board
  hideAllInputs()
  title.style.display = 'none'
  input.style.display = 'inline'
  input.value = title.innerText

  
  // It's called when enter key is pressed, after title board edition
  input.addEventListener('keyup', (event)=> {

    if (event.keyCode ===13) {
      if(event.target.parentElement.classList.contains('default')) {
        updateData('boards', id, {title:`${input.value}<i class='ph-pencil-fill'><i class='ph-trash-fill'>`});
        title.innerHTML = `${input.value}<i class='ph-pencil-fill'><i class='ph-trash-fill'>`;          
      }else {
        updateData('boards', id, {title:`${input.value}<i class='ph-pencil-fill'>`});
        title.innerHTML = `${input.value}<i class='ph-pencil-fill'>`;  
      }

      title.style.display = 'flex';
      input.style.display = 'none';
      addEventToEditName()
      addEventToRemoveBoards()
      
      
    }
  })
 
}

const showHideInputEditTask = (e) => {
  const title = e.target.closest('.title-edit-delete-wrapper').querySelector('.card_title')
  const id = e.target.closest('.title-edit-delete-wrapper').closest('.kanban-item').getAttribute('data-eid')
  const input = e.target.closest('.title-edit-delete-wrapper').querySelector('.title-edit-input')
  
  // It's called when edit icon is clicked on a task
  hideAllInputs()
  title.style.display = 'none'
  input.style.display = 'inline'
  input.value = title.innerText

  
  // It's called when enter key is pressed, after title task edition
  input.addEventListener('keyup', (event)=> {

    if (event.keyCode ===13) {
      updateData('tasks', id, {title: input.value});
      title.innerHTML = input.value;

      title.style.display = 'inline';
      input.style.display = 'none';

      addEventToEditName()
      
    }
  })
}