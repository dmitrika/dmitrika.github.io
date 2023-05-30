const start = '▶️ Start'
const stop  = '⏹ Stop'

const studentsListEl   = document.getElementById('students')
const currentCounterEl = document.getElementById('current-counter')
const currentStudentEl = document.getElementById('current-student')

const form     = document.querySelector('form');
const fieldSet = document.querySelector('fieldset')

let students       = []
let currentStudent = ''
let counters       = {}
let intervals      = {}

function formatTime(count) {
    let minutes = Math.floor(count / 60);
    let seconds = count - (minutes * 60);

    if (minutes === 0) {
    	return `${seconds}s`
    }

    if (seconds < 10) {
    	seconds = `0${seconds}`
    }

    return `${minutes}m ${seconds}s`
}

function startCount(counterId, cb) {
	intervals[counterId] = setInterval(function () {
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

function stopCurrentStudentCount() {
	const student = students.find(function (student) {
		return student.studentName === currentStudent
	})

	if (!student) {
		return
	}

	stopCount(student.counterId)

	const studentControlEl = document.getElementById(student.controlId)
	studentControlEl.innerHTML = start
	studentControlEl.classList.remove('student__control--counting');
}

function resetCurrentCount() {
	counters['current'] = 0
	currentCounterEl.innerHTML = 0
}

function startCurrentCount() {
	resetCurrentCount()

	startCount('current', function(count) {
		currentCounterEl.innerHTML = formatTime(count)
	})
}

function stopCurrentCount() {
	stopCount('current')
}

form.addEventListener('submit', function (event) {
	event.preventDefault();

	const formData    = new FormData(event.target);
	const studentName = formData.get('studentName')

	
	const errorEl = document.getElementById('error')
	if (errorEl) {
		errorEl.remove()
	}
	

	const hasDuplicate = students.some(function (s) {
		return s.studentName === studentName
	})
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

	students.push({ studentName, counterId, controlId })

	let student = document.createElement("li");
	student.innerHTML = `
		<li class="student">
			<div>${studentName}</div>
			<div> Total: <span id="${counterId}" class="student__counter">0s</span></div>
			<button id="${controlId}" class="student__control">${start}</button>
		</li>
	`

	
	studentsListEl.appendChild(student)

	const studentCounter = document.getElementById(counterId)
	const studentControl = document.getElementById(controlId)

	studentControl.addEventListener('click', function (){
		stopCurrentCount()

		if (studentControl.innerHTML === start) {
			stopCurrentStudentCount()

			currentStudent = studentName
			currentStudentEl.innerHTML = studentName
			
			startCurrentCount()

			startCount(counterId, function (count) {
				studentCounter.innerHTML = formatTime(count)
			})

			studentControl.innerHTML = stop
			studentControl.classList.add('student__control--counting');
		} else {
			stopCount(counterId)

			studentControl.innerHTML = start
			studentControl.classList.remove('student__control--counting');
		}
	})

	form.reset()
})