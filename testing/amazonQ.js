//This tells it to listen to the page as soon as it loads
window.addEventListener("load", () => {
    //This pulls the library info for the steam user
    async function getAnswer() {
        //Logs when the function is run
        console.log("running getAnswer");

        //Pulls question from form
        const question = document.getElementById("question").value;

        //Function for getting answer from aws

        async function getAWSAnswer(request) {
            console.log("running getAWSAnswer");
            const response = await fetch(
                "https://noblewolf42.com/model/anthropic.claude-3-sonnet-20240229-v1:0/converse",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(request),
                }
            );
            const json = await response.json();
            return json.response.output.message.content;
        }

        //This sets up the request JSON

        const reqJSON = {
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            text: question,
                        },
                    ],
                },
            ],
            system: [
                {
                    text: "You are a tariff expert who helps people understand current tariffs. Signal 'SUCCESS' if you can explain the issue, otherwise 'FAILURE'",
                },
            ],
            inferenceConfig: {
                stopSequences: ["SUCCESS", "FAILURE"],
            },
            additionalModelRequestFields: {
                top_k: 200,
            },
            additionalModelResponseFieldPaths: ["/stop_sequence"],
        };

        //This sets the info retrieved to a variable
        const aiAnswer = await getAWSAnswer(reqJSON);

        console.log(aiAnswer);

        //This replaces the element on the webpage to actually show the games
        document.getElementById("answer").innerHTML = aiAnswer;
    }

    //This sets an easier to call value for the form
    const form = document.getElementById("questionForm");

    //This function listens for the form being submitted and then executes the getLibrary function
    form.addEventListener("submit", () => {
        getAnswer();
    });
});
