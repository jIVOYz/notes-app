const $createNote = document.querySelector("#createNoteButton")
const $createLabel = document.querySelector("#createLabelButton")

const $aside = document.querySelector(".aside")
const $toggleSideBar = document.querySelector("#toggleSideBar")
const $toggleSideBarIcon = document.querySelector("#toggleSideBarIcon")
const $menuItem = document.querySelectorAll(".menu__item_text")

const $notesList = document.querySelector(".notes__list")
const $notes = document.querySelectorAll(".note")
const $labelsSelect = document.querySelector(".labels__select")
const $editLabelsList = document.querySelector(".editLabels__list")

const $note = document.querySelector(".currNote")
const $noteTitle = document.querySelector(".currNote__title")
const $noteLabel = document.querySelector(".currNote__label")
const $noteDeleteButton = document.querySelector(".currNote__delete")
const $noteBody = document.querySelector(".currNote__body")
const $noteLastEditedTime = document.querySelector(".lastEditedTime")

const $overlay = document.querySelector(".overlay")

let notes = JSON.parse(localStorage.getItem("app.notes")) || []
let labels = JSON.parse(localStorage.getItem("app.labels")) || []
let localStorageSideBar = JSON.parse(localStorage.getItem("app.toggleSideBar"))

const today = new Date()
const day = new Date().getDate()
const time = new Date().getHours() + ":" + new Date().getMinutes()
const month = today.toLocaleString("default", { month: "long" })
const date = `${month} ${day} at ${time}`

if (localStorageSideBar == true) {
  $aside.style.width = window.innerWidth < 479 ? "100%" : "15%"
  $menuItem.forEach($item => {
    $item.style.display = "block"
  })
  $toggleSideBarIcon.style.transform = "rotate(0deg)"
  $editLabelsList.style.display = "block"
}

if (localStorageSideBar == false) {
  $aside.style.width = "60px"
  $menuItem.forEach($item => {
    $item.style.display = "none"
  })
  $toggleSideBarIcon.style.transform = "rotate(180deg)"
  $editLabelsList.style.display = "none"
}

if (notes) {
  notes.forEach(note => {
    renderNotes(note)
  })
}

if (labels) {
  labels.forEach(label => {
    renderLabels(label)
    renderLabelsOnSideBar(label)
  })
}

function renderNotes(note) {
  const container = document.createElement("div")
  container.classList.add("note__item")
  container.classList.add("note")
  container.id = note.id

  const title = document.createElement("div")
  title.classList.add("note__title")
  title.textContent = note.title ? note.title : note.body.substr(0, 30)

  const label = document.createElement("div")
  label.classList.add("label")
  const labelBody = document.createElement("div")
  labelBody.classList.add("label__body")
  labelBody.textContent = note.label

  label.append(labelBody)
  container.append(title)
  container.append(label)
  $notesList.append(container)
}

function renderLabels(label) {
  $labelsSelect.innerHTML += `<option value="${label}">${label}</option>`
}

function renderLabelsOnSideBar(label) {
  const li = document.createElement("li")
  li.classList.add("editLabels__item")
  li.dataset.label = label

  const labelTitle = document.createElement("span")
  labelTitle.classList.add("editLabels__item_title")
  labelTitle.textContent = label
  const actionsDiv = document.createElement("div")
  actionsDiv.classList.add("editLabels__actions")

  const editBtn = document.createElement("button")
  editBtn.classList.add("editLabels__edit")
  const editIcon = document.createElement("span")
  editIcon.classList.add("material-symbols-outlined")
  editIcon.classList.add("editLabels__edit")
  editIcon.textContent = "edit"

  const deleteBtn = document.createElement("button")
  deleteBtn.classList.add("editLabels__delete")
  const deleteIcon = document.createElement("span")
  deleteIcon.classList.add("material-symbols-outlined")
  deleteIcon.classList.add("editLabels__delete")
  deleteIcon.textContent = "delete_forever"

  li.append(labelTitle)
  li.append(actionsDiv)
  actionsDiv.append(editBtn)
  actionsDiv.append(deleteBtn)
  editBtn.append(editIcon)
  deleteBtn.append(deleteIcon)
  $editLabelsList.append(li)
}

// functions

function toggleSideBar() {
  localStorageSideBar = !localStorageSideBar
  localStorage.setItem("app.toggleSideBar", JSON.stringify(localStorageSideBar))

  if (localStorageSideBar == true) {
    $aside.style.width = window.innerWidth < 479 ? "100%" : "15%"
    $menuItem.forEach($item => {
      $item.style.display = "block"
    })
    $toggleSideBarIcon.style.transform = "rotate(0deg)"
    $editLabelsList.style.display = "block"
  }

  if (localStorageSideBar == false) {
    $aside.style.width = "60px"
    $menuItem.forEach($item => {
      $item.style.display = "none"
    })
    $toggleSideBarIcon.style.transform = "rotate(180deg)"
    $editLabelsList.style.display = "none"
  }
}

function createNewNote() {
  const newNotePrompt = prompt("Note title")
  if (newNotePrompt === null) return

  const newNote = {
    id: new Date().getTime(),
    title: newNotePrompt,
    body: "",
    createdDate: date,
    lastEditedTime: date,
    label: "None",
  }
  notes.push(newNote)
  localStorage.setItem("app.notes", JSON.stringify(notes))
  renderNotes(newNote)
}

function openNote(e) {
  if (e.target.classList.contains("note")) {
    const note = notes.find(note => note.id == e.target.id)

    //* Open modal window
    $note.classList.add("openNote")
    $overlay.classList.add("active")
    labels.forEach(label => {
      $noteLabel.innerHTML += `<option value="${label}">${label}</option>`
    })

    addLabelToNote(note)

    //* Paste the data from a note
    $noteLabel.value = note.label
    $noteTitle.value = note.title
    $noteBody.value = note.body
    $noteLastEditedTime.textContent = note.lastEditedTime
    $noteBody.focus()

    //* Delete & Editing
    editNote(note)
    $noteDeleteButton.addEventListener("click", () => {
      deleteNote(note.id)
    })
  }
}

function editNote(note) {
  $noteTitle.addEventListener("change", e => {
    note.title = e.target.value
    note.lastEditedTime = date
    $noteLastEditedTime.textContent = note.lastEditedTime
    localStorage.setItem("app.notes", JSON.stringify(notes))
  })
  $noteBody.addEventListener("change", e => {
    note.body = e.target.value
    note.lastEditedTime = date
    $noteLastEditedTime.textContent = note.lastEditedTime
    localStorage.setItem("app.notes", JSON.stringify(notes))
  })
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id)
  localStorage.setItem("app.notes", JSON.stringify(notes))
  closeNote()
}

function closeNote() {
  $overlay.classList.remove("active")
  $note.classList.remove("openNote")
  location.reload()
}

// Labels
function createLabel() {
  const labelName = prompt("New label name")
  if (labelName === null) return
  if (labels.includes(labelName)) return
  let newLabel = labelName
  labels.push(newLabel)
  renderLabels(newLabel)
  renderLabelsOnSideBar(newLabel)
  localStorage.setItem("app.labels", JSON.stringify(labels))
}

function addLabelToNote(note) {
  $noteLabel.addEventListener("change", e => {
    note.label = e.target.value
    note.lastEditedTime = date
    $noteLastEditedTime.textContent = note.lastEditedTime
    $notes.forEach($n => {
      if ($n.id !== note.id) return
      if ($n.id == note.id) console.log($n)
    })

    localStorage.setItem("app.notes", JSON.stringify(notes))
  })
}
function filterNotesByLabels(e) {
  const notesArray = Array.from(document.querySelectorAll(".note"))
  const notesWithThisLabel = notes.filter(n => n.label == e.target.value)

  const notesWithThisLabelNodeList = []

  if (notesWithThisLabel.length === 0) {
    notesArray.forEach($n => ($n.style.display = "none"))
  }

  if (e.target.value == "None") {
    notesArray.forEach($n => ($n.style.display = "flex"))
  }

  notesArray.forEach($n => {
    notesWithThisLabel.forEach(n => {
      if (n.id == $n.id) {
        notesWithThisLabelNodeList.push($n)
      }
      $n.style.display = "none"
    })
  })

  notesWithThisLabelNodeList.forEach($n => {
    $n.style.display = "flex"
  })
}

function deleteLabel(e) {
  const labelElement = e.target.parentElement.parentElement.parentElement
  if (e.target.classList.contains("editLabels__delete")) {
    labels = labels.filter(l => l !== labelElement.dataset.label)

    // Remove Label from page
    labelElement.remove()
    Array.from($labelsSelect).forEach($l => {
      if ($l.value == labelElement.dataset.label) {
        $l.remove()
      }
    })

    const notesArray = Array.from(document.querySelectorAll(".note"))
    notesArray.forEach($n => {
      if ($n.querySelector(".label__body").textContent == labelElement.dataset.label) {
        $n.querySelector(".label__body").textContent = "None"
      }
    })

    notes.forEach(n => {
      if (n.label == labelElement.dataset.label) {
        n.label = "None"
      }
    })

    localStorage.setItem("app.notes", JSON.stringify(notes))
    localStorage.setItem("app.labels", JSON.stringify(labels))
  }
}

function editLabel(e) {
  const parentElement = e.target.parentElement.parentElement.parentElement
  const labelElement = parentElement.querySelector(".editLabels__item_title")
  const labelIndex = labels.indexOf(parentElement.dataset.label)
  const previousLabelName = parentElement.dataset.label

  if (e.target.classList.contains("editLabels__edit")) {
    labelElement.contentEditable = true
    labelElement.focus()

    labelElement.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault()
        labelElement.removeAttribute("contenteditable")
        labels[labelIndex] = labelElement.textContent

        Array.from($labelsSelect).forEach($l => {
          if ($l.value == labelElement.dataset.label) {
            $l.value = labelElement.textContent
            $l.textContent = labelElement.textContent
          }
        })

        notes.forEach(n => {
          if (n.label == previousLabelName) {
            n.label = labels[labelIndex]
          }
        })

        const notesArray = Array.from(document.querySelectorAll(".note"))
        notesArray.forEach($n => {
          if ($n.querySelector(".label__body").textContent == previousLabelName) {
            $n.querySelector(".label__body").textContent = labels[labelIndex]
          }
        })

        localStorage.setItem("app.labels", JSON.stringify(labels))
        localStorage.setItem("app.notes", JSON.stringify(notes))
      }
    })

    labelElement.addEventListener("blur", () => {
      labelElement.removeAttribute("contenteditable")
      labels[labelIndex] = labelElement.textContent

      Array.from($labelsSelect)[labelIndex + 1].value = labels[labelIndex]
      Array.from($labelsSelect)[labelIndex + 1].textContent = labels[labelIndex]

      notes.forEach(n => {
        if (n.label == previousLabelName) {
          n.label = labels[labelIndex]
        }
      })

      const notesArray = Array.from(document.querySelectorAll(".note"))
      notesArray.forEach($n => {
        if ($n.querySelector(".label__body").textContent == previousLabelName) {
          $n.querySelector(".label__body").textContent = labels[labelIndex]
        }
      })

      localStorage.setItem("app.labels", JSON.stringify(labels))
      localStorage.setItem("app.notes", JSON.stringify(notes))
    })
  }
}

// event listeners
document.addEventListener("click", e => openNote(e))
$editLabelsList.addEventListener("click", e => deleteLabel(e))
$editLabelsList.addEventListener("click", e => editLabel(e))
$toggleSideBar.addEventListener("click", toggleSideBar)
$createNote.addEventListener("click", createNewNote)
$createLabel.addEventListener("click", createLabel)
$overlay.addEventListener("click", closeNote)
$labelsSelect.addEventListener("change", e => filterNotesByLabels(e))
