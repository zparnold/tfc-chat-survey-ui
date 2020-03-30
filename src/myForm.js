import React from 'react';
import {ConversationalForm} from 'conversational-form';
import uuid from 'react-uuid'


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
        const cssStyle = {
            'display': 'none'
        };
        return (
            <div>
                <div
                    ref={ref => this.elem = ref}
                />
                <div id="uuid" style={cssStyle}>{this.state.uuid}</div>
            </div>
        );
    }

    getFormData() {
        return [
            {
                "tag": "select",
                "cf-input-placeholder": "Choose multiple of the above...then click the button to the right",
                "multiple": "multiple",
                "cf-questions": "Hi there, and welcome to the Family Collective!&&We're going to ask you some personal but important questions, so please be as vulnerable as you can.&&We're not collecting any personal identifiable information. So please know that anything you share with us will be kept private.&&We're trying to learn how to serve and connect you to communities that will best meet your needs. Ok? Let's do this!&&Please let us know any relationships that you are having problems with at this time: (you can pick multiple)",
                "children": [
                    {
                        "tag": "option",
                        "name": "relationship",
                        "cf-label": "Friends",
                        "value": "friends"
                    },
                    {
                        "tag": "option",
                        "name": "relationship",
                        "cf-label": "Children",
                        "value": "children"
                    },
                    {
                        "tag": "option",
                        "name": "relationship",
                        "cf-label": "Parents",
                        "value": "parents"
                    },
                    {
                        "tag": "option",
                        "name": "relationship",
                        "cf-label": "In-Laws",
                        "value": "in-laws"
                    },
                    {
                        "tag": "option",
                        "name": "relationship",
                        "cf-label": "Co-Workers",
                        "value": "co-workers"
                    },
                    {
                        "tag": "option",
                        "name": "relationship",
                        "cf-label": "Spouse",
                        "value": "spouse"
                    }
                ]
            },
            {
                "tag": "fieldset",
                "type": "Radio buttons",
                "cf-input-placeholder": "Choose one of the above",
                "cf-questions": "Thanks!&&Now let us know how big of a problem this was for you in the past month:",
                "children": [
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Not at All ',
                        "name": "severity",
                        'value': 'none'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Mildly but it didn’t bother me much',
                        "name": "severity",
                        'value': 'mild'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Moderately - it wasn’t pleasant at times',
                        "name": "severity",
                        'value': 'moderate'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Severely – it bothered me a lot',
                        "name": "severity",
                        'value': 'severe'
                    }
                ]
            },
            {
                "tag": "fieldset",
                "id": "feelings",
                "type": "Checkboxes",
                "cf-input-placeholder": "Choose 3 above",
                "cf-questions": "Please describe how you are feeling about these difficult relationships (Pick the Top 3):",
                "cf-error":"Please only choose 3 feelings",
                "children": [
                    {
                        "tag": "input",
                        "type": "checkbox",
                        "cf-label": "Anxious and Worried",
                        "name": "feelings",
                        "value": "anxious"
                    },
                    {
                        "tag": "input",
                        "type": "checkbox",
                        "value": "depressed",
                        "name": "feelings",
                        "cf-label": "Depressed and Feeling Down"
                    },
                    {
                        "tag": "input",
                        "type": "checkbox",
                        "value": "angry",
                        "name": "feelings",
                        "cf-label": "Angry and Irritable"
                    },
                    {
                        "tag": "input",
                        "type": "checkbox",
                        "value": "sad",
                        "name": "feelings",
                        "cf-label": "Sadness or Grief"
                    },
                    {
                        "tag": "input",
                        "type": "checkbox",
                        "value": "confused",
                        "name": "feelings",
                        "cf-label": "Confused and Restless"
                    },
                    {
                        "tag": "input",
                        "type": "checkbox",
                        "value": "rejected",
                        "name": "feelings",
                        "cf-label": "Rejected and Feeling Inferior"
                    },
                    {
                        "tag": "input",
                        "type": "checkbox",
                        "value": "guilty",
                        "name": "feelings",
                        "cf-label": "Feeling Guilt and Shame"
                    },
                    {
                        "tag": "input",
                        "type": "checkbox",
                        "value": "lonely",
                        "name": "feelings",
                        "cf-label": "Lonely and Withdrawn"
                    }
                ],
            },
            {
                "tag": "fieldset",
                "type": "Radio buttons",
                "cf-input-placeholder": "Choose one of the above",
                "cf-questions": "Now tell us how often you are having those thoughts/feelings:",
                "name": "occurrence",
                "children": [
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Not at All',
                        'value': 'none'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Seldom-2x per week',
                        'value': 'seldom'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Occasionally-every other day',
                        'value': 'occasionally'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Often-daily',
                        'value': 'often'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'All the Time',
                        'value': 'constantly'
                    }
                ]
            },
            {
                "tag": "fieldset",
                "type": "Radio buttons",
                "cf-input-placeholder": "Choose one of the above",
                "cf-questions": "We Are with You. How Can We Help?",
                "children": [
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Help You Locate a Counselor Referral in Your Community',
                        "name": "cta",
                        'value': 'referral'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Help You Find or Start a Local Community',
                        "name": "cta",
                        'value': 'in_person_community'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Enroll You in An On-Line Community',
                        "name": "cta",
                        'value': 'online_community'
                    },
                    {
                        'tag': 'input',
                        'type': 'radio',
                        'cf-label': 'Get You to Some Amazing Resources',
                        "name": "cta",
                        'value': 'resources'
                    }
                ]
            }
            ]
    }
}