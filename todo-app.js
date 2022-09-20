// 8.2 todo разметка

(function(){
  let listArray = [],
      listName = '';

    // создаём и возвращаем заголовок приложение
    function appTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // Создаём и возвращаем форму для создания тела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        if(!input.value) {
             button.setAttribute('disabled', 'disabled');
        }

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        }
    }

    // Создаём и возвращаем список элементов
    function createToDoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');
        // кнопки перемещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        if (obj.done === true) {
          item.classList.toggle('list-group-item-success');
        }

        // Устанавливаем стили для элемента списка, а также для размещения кнопок
        // в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // Добавляем обработчик кнопки
        doneButton.addEventListener('click', function() {
          item.classList.toggle('list-group-item-success');
          const currentName = item.firstChild.textContent;
          for (const listItem of listArray) {
            if(listItem.name === currentName) {
              listItem.done = !listItem.done;
            }
          }
          saveList(listArray, listName);;
        })

        deleteButton.addEventListener('click', function() {
          if (confirm('Вы уверены?')) {
              item.remove();

              const currentName = item.firstChild.textContent;

              for (let i = 0; i < listArray.length; i++) {
                if(listArray[i].name === currentName && obj.id === listArray[i].id) {
                  listArray.splice(i, 1);
                }
              }

              saveList(listArray, listName);
          }
        })

        // Вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function getNewId(arr) {
      let max = 0;
      for (let item of arr) {
        if (item.id > max) {
          max = item.id;
        }
      }
      return max + 1;
    }

    function saveList(arr, keyName) {
      localStorage.setItem(keyName, JSON.stringify(arr))
    }

    function createTodoApp(conteiner, title, keyName, defArr = []) {         //, toDoArr = [firstTask = {name:'купить хлеб', done: false}, secondTask = {name:'ДЗ', done: true}]

      let todoAppTitle = appTitle(title);
      let todoList = createToDoList();
      let todoItemForm = createTodoItemForm();

      listName = keyName;

      listArray = defArr;

      conteiner.append(todoAppTitle);
      conteiner.append(todoItemForm.form);
      conteiner.append(todoList);

      let localData = localStorage.getItem(listName);

      if (localData !== null && localData !== '') {
        listArray = JSON.parse(localData);
      }

      for (const itemList of listArray) {
        let todoItem = createTodoItem(itemList);
        todoList.append(todoItem.item);
      }

      // if (toDoArr.length > 0) {
      //   for (let obj of toDoArr) {
      //     let objIsides = Object.values(obj);
      //     if (objIsides.length < 3 && objIsides.length > 0) {

      //       console.log(objIsides[0]);
      //       let itemObj = createTodoItem(obj);
      //       todoList.append(itemObj.item);
      //       listArray.push(itemObj);

      //       itemObj.doneButton.addEventListener('click', function() {
      //         itemObj.item.classList.toggle('list-group-item-success');
      //       })

      //       itemObj.deleteButton.addEventListener('click', function() {
      //         if (confirm('Вы уверены?')) {
      //             itemObj.item.remove();
      //             let itemObjIndex = listArray.indexOf(itemObj, 0)
      //             listArray.splice(itemObjIndex, 1);
      //             console.log(listArray, '---', itemObjIndex );
      //         }
      //       })
      //     }
      //   }
      // }


      // todoList.append(todoItem.item);

      todoItemForm.form.addEventListener('submit', function(e) {
          // Эта строчка необходима, чтобы предотвратить стандартное действие браузера
          // В данном случае мы не хотим, чтобы страница перезагружалась при отправки формы
          e.preventDefault();

          // Игнорируем создание эелемента, если пользователь ничего не ввёл в поле ввода
          if (!todoItemForm.input.value) {
              return;
          }

          let newItem = {
            id: getNewId(listArray),
            name: todoItemForm.input.value,
            done: false,
          }

          let todoItem = createTodoItem(newItem);

          listArray.push(newItem);

          todoList.append(todoItem.item);

          todoItemForm.input.value = "";
          todoItemForm.button.setAttribute('disabled', 'disabled');

          saveList(listArray, listName);

      });
      // Кнопка "добавить дело" disbled
      todoItemForm.input.addEventListener('input', function() {
          if (todoItemForm.input.value === '') {
              todoItemForm.button.setAttribute('disabled', 'disabled');
          } else {
              todoItemForm.button.removeAttribute('disabled');
          }
      });

      // return todoItem;
    }

    window.createTodoApp = createTodoApp;

})();
