const stateMachine = "Floor 3 - demo";

// Create Rive
const riveInstance = new rive.Rive({
	src: "src/floor 3 demo.riv", //get rive file
	canvas: document.getElementById("rive"), //get correct canvas
	autoplay: true,
	stateMachines: stateMachine, // get correct stateMachine
	automaticallyHandleEvents: true, // Automatically handle RiveHTTPEvents
	onLoad: onLoadHandler,
});

const lessons = 3; // Number of lessons
const inputLessonsStarted = []; // Lessons status
const inputLessonsDone = []; // Lessons status
const inputIsLessonsHover = []; // Lesson pointer hover
const inputLessonsTrigger = []; // Lesson trigger movement

// Handle the onLoad event
function onLoadHandler() {
	// Prevent a blurry canvas by using the device pixel ratio
	riveInstance.resizeDrawingSurfaceToCanvas();

	// Get inputs
	const inputs = riveInstance.stateMachineInputs(stateMachine);

	// Change marble's color [0, 1 , 2, 3]
	let playerID = 0; // Var to change player
	playerSelector = inputs.find((i) => i.name === "playerProfile");
	playerSelector.value = playerID;

	inputMarbleHover = inputs.find((i) => i.name === "marble hovering");

	for (let i = 1; i <= lessons; i++) {
		// Get lesson started status
		// inputLessonsStarted[0].value = true; (true, false)
		inputLessonsStarted.push(
			inputs.find((input) => input.name === `isLesson${i}Started`)
		);

		// Get lesson done status
		// inputLessonsDone[0].value = true; (true, false)
		inputLessonsDone.push(
			inputs.find((input) => input.name === `isLesson${i}Done`)
		);

		// Hover effect
		inputIsLessonsHover.push(
			inputs.find((input) => input.name === `Lesson ${i} Hover`)
		);

		// Triggers marble animation
		// inputLessonsTrigger[0].fire()
		inputLessonsTrigger.push(
			inputs.find((input) => input.name === `Trigger Lesson ${i}`)
		);
	}
	// Trigger marble to next level
	triggerNextLevel = inputs.find((i) => i.name === "Trigger Next Level");

	inputLessonsCounter = inputs.find((i) => i.name === "lessonCounter");
}

// Resize the drawing surface if the window resizes
window.addEventListener(
	"resize",
	() => {
		riveInstance.resizeDrawingSurfaceToCanvas();
	},
	false
);

// Events handling setup
const eventFire = (riveEvent) => {
	const eventData = riveEvent.data;
	const eventName = eventData.name;
	const eventProperties = eventData.properties;

	const eventKey = eventName.split("-")[0];
	const eventIndex = eventName.slice(-1);

	switch (eventKey) {
		// Fire marble movements from card's buttons
		case "cardbutton":
			if (eventName.split("-")[1] == "next") return triggerNextLevel.fire();
			if (Number.isInteger(Number(eventIndex)))
				return inputLessonsTrigger[eventIndex - 1].fire();
			break;

		// logic when marble arrives
		case "On":
			inputMarbleHover.value = true;

			riveInstance.setBooleanStateAtPath(
				"lessonHover",
				true,
				`Lesson ${eventIndex}`
			);

			riveInstance
				.stateMachineInputs(stateMachine)
				.find((i) => i.name === `isOn${eventIndex}`).value = true;
			break;

		// logic when marble leaves
		case "Off":
			inputMarbleHover.value = false;

			riveInstance.setBooleanStateAtPath(
				"lessonHover",
				false,
				`Lesson ${eventIndex}`
			);

			riveInstance
				.stateMachineInputs(stateMachine)
				.find((i) => i.name === `isOn${eventIndex}`).value = false;
			break;

		// Lesson launcher
		case "LessonEvent":
		case "NextLevel":
			console.log(eventName);
			break;

		case "OnHoverEnter":
			document.body.style.cursor = "pointer";
			break;
		case "OnHoverExit":
			document.body.style.cursor = "auto";
			break;
		case "OnClick":
			// Custom logic for click event
			break;

		default:
			console.log("Unhandled event:", eventName, "\n", riveEvent);
			break;
	}
};

// Register the event handler
riveInstance.on(rive.EventType.RiveEvent, eventFire);

// To update number in counter
const lessonCounter = () => {
	let total = 0;
	for (let i = 0; i < lessons; i++) {
		total += inputLessonsDone[i].value == true ? 1 : 0;
	}
	return (inputLessonsCounter.value = total);
};
