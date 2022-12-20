// it sorts an object array by order column: board_order or task_order.
const sortResponseByOrder = (array) => [
  array.sort((a,b)=>{
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
]

const getData = async () => {
  
  const dataBoards = await readData('boards')
  const dataTasks = await readData('tasks')
  
  sortResponseByOrder(dataTasks)

  console.log(await dataTasks)
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
  InstanceKanban(boards, await dataTasks, dataBoards)  
}

window.addEventListener('load', getData)

var InstanceKanban = async (allBoards, allTasks, prevBoards) => {
  
  var KanbanManager = await new jkanban({
    element: "#dTrello",
    gutter: "10px",
    widthBoard: "450px",
    itemHandleOptions:{
      enabled: true,
    },
    click: function(el) {
      console.log("Trigger on all items click!");
    },
    context: function(el, e) {
      console.log("Trigger on all items right-click!");
    },

    // 1- Inserts the task element in the DOM at the position it was dropped in. 
    // 2 - Updates the parent board in the moved task
    // 3 - Updates the tasks order in the source and target board at database.
    dropEl: function(el, target, source, sibling){
      sibling ? target.insertBefore(el, sibling) : target.appendChild(el)

      const boardTargetId = target.parentElement.id
      const taskId = el.dataset.eid
      const targetChildrenCollection = target.children
      const targetChildrenNodes = [...targetChildrenCollection]
      const sourceChildrenCollection = source.children
      const sourceChildrenNodes = [...sourceChildrenCollection]
      const elementIndex = targetChildrenNodes.findIndex(element => element.dataset.eid === el.dataset.eid)
            
      updateData('tasks', taskId, { board_id: boardTargetId })
      
      sourceChildrenNodes.forEach((task, index) => {
        const id = task.dataset.eid
        updateTaskOrder(id, index)
      })

      targetChildrenNodes.forEach((task, index) => {
        const id = task.dataset.eid
        updateTaskOrder(id, index)
      })
    },
    buttonClick: function(el, boardId) {
      console.log(el);
      console.log(boardId);
      hideAllInputs()
      // create a form to enter element
      var formItem = document.createElement("form");
      formItem.setAttribute("class", "itemform");
      formItem.innerHTML =
        `<div class="form-group"><textarea class="form-control" rows="2" autofocus></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary btn-xs pull-right">Submit</button><button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">Cancel</button></div>`;

      

      KanbanManager.addForm(boardId, formItem);
      
      formItem.addEventListener("submit", function(e) {
        e.preventDefault();
        var text = e.target[0].value;
        const boardId = e.target.closest('.kanban-drag').closest('.kanban-board').id
        const childrenLength = e.target.parentElement.children.length
        console.log(childrenLength)
        
        if (text) {
          createData('tasks', {title: text, board_id:boardId, task_order:childrenLength}).then(getData)
          formItem.parentNode.removeChild(formItem);
        } else {
          Swal.fire({
            title: 'Insira um nome para o novo card!',
      
          })
        }
      });      
    },
    itemAddOptions: {
      enabled: true,
      content: '+ Add New Card',
      class: 'custom-button',
      footer: true
    },   
    
    boards:allBoards
    
  })

  document.querySelectorAll('.kanban-board-header').forEach(header=> header.innerHTML += `<input type="text" class="kanban-title-input">`)

  

  addEventToEditName()

  
  //Iterate over each trash icon of the boards, adding a listener that fires a deletion function, passing the board's id as argument.
  document.querySelectorAll('.kanban-title-board .ph-trash-fill').forEach(trashIcon=> trashIcon.addEventListener('click',(e)=>{
    e.stopPropagation()
    const board = trashIcon.closest('.kanban-title-board').closest('.kanban-board-header').closest('.kanban-board')

    confirmRemoveBoard(board.id)

  }))

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

const addEventToEditName = () => {
  document.querySelectorAll('.kanban-board-header .ph-pencil-fill').forEach(     pencilIcon=> pencilIcon.addEventListener('click',  showHideInputEditBoard)) 

  document.querySelectorAll('.kanban-item .ph-pencil-fill').forEach(pencilIcon=> pencilIcon.addEventListener('click', showHideInputEditTask )) 
  

  
}

const filterCards = () => {
  const search = document.querySelector('#search').value
  const cards = document.querySelectorAll('.kanban-item')
  cards.forEach(card => {
    if(search){
      if(!card.querySelector('.card_title').innerHTML.includes(search)) {
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
    showCancelButton: true,
    inputValue:""
}).then(boardName=>{
    if(boardName.value === "") {
      nameNewBoard()
    } else {
        if(boardName.isConfirmed === true) {
          const container = document.querySelector('#dTrello')
          readData('boards').then(boards => {
            createData('boards',
            {
              title: `${boardName.value}<i class='ph-pencil-fill'><i class='ph-trash-fill'>`,
              class: 'default',
              board_order: boards.length + 1
            }
          ).then(data => getData().then(
            setTimeout(()=>{
              container.scrollLeft = container.scrollWidth
            },400)
          )); 
          })        
          
          
          
        }
    }
  })         
}

var addBoard = document.getElementById("addNewBoard");
addBoard.addEventListener("click", nameNewBoard);

const confirmRemoveBoard = (boardId) => {
  Swal.fire({
    title: 'Gostaria realmente de deletar este quadro?',
    showCancelButton: true,
}).then(button=> {
  if(button.isConfirmed === true){
  deleteData('boards', boardId).then(getData)
}
 } )
}

//This function receive a card element as argument and opens a confirm modal. If the confirm button is clicked, the card will be removed.
const confirmRemoveCard = (cardId) => {
  Swal.fire({
    title: 'Gostaria realmente de deletar este card?',
    showCancelButton: true,
}).then(button=> {
  if(button.isConfirmed === true){
  deleteData('tasks', cardId).then(getData)
}
 } )
}

const updateTaskOrder = (id, index) => {
  const order = index +1
  updateData('tasks', id, {task_order: order})
}

// Set display "none" for all inputs in the boards' title and restore the initial condition to the titles: display "inline".
const hideAllInputs = () => {
  document.querySelectorAll('.kanban-title-input').forEach(input => {
    input.style.display = 'none'
  })

  document.querySelectorAll('.kanban-title-board').forEach(input => {
    input.style.display = 'inline'
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

const showHideInputEditBoard = (e) => {
  const title = e.target.closest('.kanban-title-board')
  const id = title.closest('.kanban-board-header').closest('.kanban-board').id
  const input = e.target.closest('.kanban-title-board').closest('.kanban-board-header').querySelector('.kanban-title-input')
  
  hideAllInputs()
  title.style.display = 'none'
  input.style.display = 'inline'
  input.value = title.innerText

  

  input.addEventListener('keyup', (event)=> {

    if (event.keyCode ===13) {
      if(id == 6 || id == 7 || id == 24) {
        updateData('boards', id, {title:`${input.value}<i class='ph-pencil-fill'>`});
        title.innerHTML = `${input.value}<i class='ph-pencil-fill'>`;
      }else {
        updateData('boards', id, {title:`${input.value}<i class='ph-pencil-fill'><i class='ph-trash-fill'>`});
        title.innerHTML = `${input.value}<i class='ph-pencil-fill'><i class='ph-trash-fill'>`;        
      }

      title.style.display = 'inline';
      input.style.display = 'none';
      addEventToEditName()
      
    }
  })
 
}

const showHideInputEditTask = (e) => {
  const title = e.target.closest('.title-edit-delete-wrapper').querySelector('.card_title')
  const id = e.target.closest('.title-edit-delete-wrapper').closest('.kanban-item').getAttribute('data-eid')
  const input = e.target.closest('.title-edit-delete-wrapper').querySelector('.title-edit-input')
  
  console.log(input)

  

  hideAllInputs()
  title.style.display = 'none'
  input.style.display = 'inline'
  input.value = title.innerText

  

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






