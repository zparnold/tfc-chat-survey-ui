import React from 'react';
import {ConversationalForm} from 'conversational-form';
import uuid from 'react-uuid'
import questions from './questions.json';


export default class MyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {formFields: this.getFormData(), uuid: uuid()};
        this.submitCallback = this.submitCallback.bind(this);
    }

    componentDidMount() {
        this.cf = ConversationalForm.startTheConversation({
            options: {
                submitCallback: this.submitCallback,
                theme: "green",
                robotImage: "text:TFC",
                userImage: "text:You",
                showProgressBar: true,
                preventAutoAppend: true,
                flowStepCallback: function (dto, success, error) {
                    const url = 'https://hxkss1keti.execute-api.us-east-1.amazonaws.com/prod/formResponse';
                    if (dto.tag.id === "feelings" && dto.tag.value.length !== 3) {
                        return error();
                    } else {
                        let uuid = document.getElementById('uuid').innerText;
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ formResponseId: uuid, tagData: dto.tag.value, tagId: dto.tag.name })
                        };
                        fetch(url, requestOptions).then((resp) => {
                            return success();
                        }).catch((error) => {
                            console.log(error);
                            return success();
                        });
                    }
                }
            },
            tags: this.state.formFields
        });
        this.elem.appendChild(this.cf.el);
    }

    submitCallback() {
        this.cf.addRobotChatResponse("Thank you! 🥳 Your input is extremely valuable to our learning and development of " +
            "what we're hoping The Family Collective can be!&&If you want to find out when we launch, please sign up to " +
            "join our email list here: <a href='https://thefamilycollective.co'>https://thefamilycollective.co</a>")
    }

    render() {
        return (
            <div>
                <div ref={ref => this.elem = ref}/>
                <div id="uuid" className="uuid">{this.state.uuid}</div>
            </div>
        );
    }

    getFormData() {
        return questions;
    }
}