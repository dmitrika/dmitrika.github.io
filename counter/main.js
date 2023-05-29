const start = 'Start'
const stop  = 'Stop'

const studentsListEl   = document.getElementById('students')
const currentCounterEl = document.getElementById('current-counter')
const currentStudentEl = document.getElementById('current-student')

const form     = document.querySelector('form');
const fieldSet = document.querySelector('fieldset')

let students       = []
let currentStudent = ''
let counters       = {}
let intervals      = {}

function startCount(counterId, cb) {
	intervals[counterId] = setInterval(() => {
		if (counters[counterId]) {
			counters[counterId] += 1
		} else {
			counters[counterId] = 1
		}

		cb(counters[counterId])
	}, 1000)
}

function stopCount(counterId) {
	clearInterval(intervals[counterId])
}


function updateCurrentStudent(studentName) {
	const prevStudent = students.find(student => student.studentName === currentStudent)

	if (prevStudent) {
		const prevStudentControlEl = document.getElementById(prevStudent.controlId)
		prevStudentControlEl.innerHTML = start
		prevStudentControlEl.classList.remove('student__control--counting');
	}

	currentStudentEl.innerHTML = studentName
	currentStudent = studentName
}

function stopAllcounters() {
	Object.values(intervals).forEach((interval) => {
		clearInterval(interval)
	})
}

function resetCurrentCount() {
	counters['current'] = 0
	currentCounterEl.innerHTML = 0
}

function startCurrentCount() {
	resetCurrentCount()

	startCount('current', (count) => {
		currentCounterEl.innerHTML = count
	})
}

function stopCurrentCount() {
	stopCount('current')
}

form.addEventListener('submit', (event) => {
	event.preventDefault();

	const formData    = new FormData(event.target);
	const studentName = formData.get('studentName')

	
	document.getElementById('error')?.remove()

	const hasDuplicate = students.some(s => s.studentName === studentName)
	if (hasDuplicate) {
		const newErrorEl = document.createElement('div')
		newErrorEl.id = 'error'
		newErrorEl.innerHTML = `Student with name ${studentName} already added`
		newErrorEl.classList.add('form__error')
		fieldSet.appendChild(newErrorEl)
		return
	}

	const counterId = `counter-${studentName}`
	const controlId = `control-${studentName}`

	students.push({
		studentName,
		counterId,
		controlId,
	})

	let student = document.createElement("li");
	student.innerHTML = `
		<li class="student">
			<div>${studentName}</div>
			<div> Total: <span id="${counterId}" class="student__counter">0</span> sec</div>
			<button id="${controlId}" class="student__control">Start</button>
		</li>
	`

	
	studentsListEl.appendChild(student)

	const studentCounter = document.getElementById(counterId)
	const studentControl = document.getElementById(controlId)

	studentControl.addEventListener('click', () => {
		if (studentControl.innerHTML === start) {
			updateCurrentStudent(studentName)

			stopAllcounters()

			startCount(counterId, (count) => {
				studentCounter.innerHTML = count
			})

			startCurrentCount()

			studentControl.innerHTML = stop
			studentControl.classList.add('student__control--counting');
		} else {
			stopCount(counterId)
			stopCurrentCount()
			studentControl.innerHTML = start
			studentControl.classList.remove('student__control--counting');
		}
	})
})