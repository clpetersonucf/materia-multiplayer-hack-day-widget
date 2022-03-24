import React, { useState, useEffect } from 'react'

const QuestionReview = (props) => {

	const getAnswerValue = (id) => {
		console.log(id)
		if (!props.show) return 'TBD'
		else return props.qset.items[props.currentIndex].answers.filter(answer => answer.id == id)[0]?.text
	}

	const playerList = props.timeline.map((client, index) =>
		<div className={`timeline-response ${client.player == props.playerId ? 'current-user' : ''}`} key={index}><span className='bold'>{client.player == props.playerId ? 'You' : 'Other Player'}</span> answered: {getAnswerValue(client.value)}</div>
	)

	return (
		<div className={`question-review ${props.show ? 'show': ''}`}>
			<h2>Question {props.currentIndex + 1} Review</h2>
			{playerList}
			<button className='close' onClick={props.advanceQuestion}>Continue</button>
		</div>
	)
}

export default QuestionReview