const getData = async () => {
  const data = await readData('boards')
  let boards = []
  for (let board in await data) {
    boards.push(
      {
        id: `_todo${data[board].id}`,
        title: data[board].title,
        class: data[board].class,
        dragTo: [],
      }
    )
  }
  InstanceKanban(boards)
  
}

window.addEventListener('load', getData)

var InstanceKanban = (allBoards) => {
  const KanbanManager = new jkanban({
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
        if (text) {
          KanbanManager.addElement(boardId, {
          title: text
        });
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
  var allEle = KanbanManager.getBoardElements("_todo");
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
          KanbanManager.addBoards([
            {
              id: boardName.value,
              title: `${boardName.value}<i class='ph-pencil-fill'><i class='ph-trash-fill'>`,
              item: []
            }
          ]); 
          
          container.scrollLeft = container.scrollWidth
        }
    }
  })         
}

var addBoard = document.getElementById("addNewBoard");
addBoard.addEventListener("click", nameNewBoard);

//This function receive a card element as argument and opens a confirm modal. If the confirm button is clicked, the card will be removed.
const confirmRemoveCard = (cardId) => {
  Swal.fire({
    title: 'Gostaria realmente de deletar este card?',
    showCancelButton: true,
}).then(button=> button.isConfirmed === true && cardId.remove())
}

