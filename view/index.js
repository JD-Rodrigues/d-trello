const getData = async () => {
  
  const dataBoards = await readData('boards')
  const dataTasks = await readData('tasks')
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
    dropEl: function(el, target, source, sibling){
      console.log(target.parentElement.getAttribute('data-id'));
      console.log(el, target, source, sibling)
    },
    buttonClick: function(el, boardId) {
      console.log(el);
      console.log(boardId);
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
        
        if (text) {
          createData('tasks', {title: text, board_id:boardId, task_order:8}).then(getData)
          formItem.parentNode.removeChild(formItem);
        } else {
          Swal.fire({
            title: 'Insira um nome para o novo card!',
      
          })
        }
      });
      document.getElementById("CancelBtn").onclick = function() {
        formItem.parentNode.removeChild(formItem);
      };
      
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
  document.querySelectorAll('.kanban-title-board .ph-trash-fill').forEach(trashIcon=> trashIcon.addEventListener('click',()=>{

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
  }

  renderTasks()
  
  var allEle = KanbanManager.getBoardElements("_todo");
  
}

const addEventToEditName = () => {
  document.querySelectorAll('.kanban-board-header .ph-pencil-fill').forEach(     pencilIcon=> pencilIcon.addEventListener('click',  showHideInputEdit)) 
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

// Set display "none" for all inputs in the boards' title and restore the initial condition to the titles: display "inline".
const hideAllInputs = () => {
  document.querySelectorAll('.kanban-title-input').forEach(input => {
    input.style.display = 'none'
  })

  document.querySelectorAll('.kanban-title-board').forEach(input => {
    input.style.display = 'inline'
  })
}

const showHideInputEdit = (e) => {
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



