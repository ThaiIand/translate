let apiKey1 = "";
let apiKey2 = "";
let apiLink = "";
let region = "";
localStorage.setItem('tourism_lang', "en")
localStorage.setItem('tourism_translated', "0")
fetch('./config.json')
    .then(response => response.json())
    .then(jsonData => {
        apiKey1 = jsonData.API_KEY1;
        apiKey2 = jsonData.API_KEY2;
        apiLink = jsonData.END_POINT;
        region = jsonData.REGION;
        startTranslation();
    })
    .catch(error => {
        console.error("Get Config Data Error:", error);
    });

let lang_source = [];
let i = 0;
const contentToTranslate = document.getElementsByTagName('body')[0];

function startTranslation() {

    const endpoint = apiLink + "/languages?api-version=3.0";

    const headers = {
        "Ocp-Apim-Subscription-Key": apiKey1,
        "Ocp-Apim-Subscription-Region": region,
    };

    fetch(endpoint, {
        method: "GET",
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            const languages = data.translation;
            let lang_list = '<span class="single-language active" code="th" >Thai (ไทย)</span>';
            let lang_list_input = '<span class="single-language active" code="0" >Auto Detect</span>';
            for (const code in languages) {
                lang_list_input += '<span class="single-language"  code="' + code + '">' + languages[code].nativeName + '</span>';
            }
            let content = "";
            content += '<div class="input-area"><span>From: <div class="language-list"><div current-lang="0" class="select-wrapper">Auto Detect<span class="dropdown-svg"><svg><use href="#FxSymbol0-035"></use></svg></span></div><div class="display-area">' + lang_list_input + '</div></div></span><textarea></textarea></div>';
            content += '<div class="output-area"><span>To: Thai (ไทย)</span><textarea></textarea></div>';
            content += '<svg style="display:none;"><defs><symbol viewBox="0 0 14.7 8.1" id="FxSymbol0-035" ><g><title></title><path d="m.7 0 6.7 6.6L14 0l.7.7-7.3 7.4L0 .7.7 0z"></path></g></symbol></defs></svg>';
            document.querySelector('#thai_translation_container').innerHTML = content;

            var selectInputWrapper = document.querySelector('#thai_translation_container .input-area .select-wrapper');
            var displayInputArea = document.querySelector('#thai_translation_container .input-area .display-area');
            var input = document.querySelector('#thai_translation_container .input-area textarea');
            var output = document.querySelector('#thai_translation_container .output-area textarea');


            selectInputWrapper.addEventListener('click', function () {
                displayInputArea.classList.toggle('open');
            });

            var items = document.querySelectorAll('#thai_translation_container .input-area .single-language');

            items.forEach(function (item) {
                item.addEventListener('click', function () {
                    selectInputWrapper.innerHTML = this.innerHTML + '<span class="dropdown-svg"><svg><use href="#FxSymbol0-035"></use></svg></span>';
                    displayInputArea.classList.toggle('open');
                    selectInputWrapper.setAttribute('current-lang', this.getAttribute('code'));
                    translateText(input.value, this.getAttribute('code'));
                    document.querySelector('#thai_translation_container .input-area .single-language.active').classList.toggle('active');
                    this.classList.add('active');
                });
            });

            function translateText(text, from) {
                if(text && text.trim() !== "") {
                    let endpoint = apiLink + "/translate?api-version=3.0";

                    if (from !== "0") {
                        endpoint += '&from=' + from;
                    }

                    fetch(`${endpoint}&to=th`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "Ocp-Apim-Subscription-Key": apiKey1,
                            "Ocp-Apim-Subscription-Region": region,
                        },
                        body: JSON.stringify([{ text: text }])
                    })
                        .then(response => response.json())
                        .then(data => {
                            const translation = data[0].translations[0].text;
                            if(input.value.trim() !== '') {
                                if(from === '0') {
                                    selectInputWrapper.innerHTML = languages[data[0].detectedLanguage.language].nativeName + " - Detected" + '<span class="dropdown-svg"><svg><use href="#FxSymbol0-035"></use></svg></span>';
                                }
                                output.value = translation;
                            }
                        })
                        .catch(error => {
                            console.error('Translation error:', error);
                        });
                } else {
                    output.value = "";
                    if(from === '0') {
                        selectInputWrapper.innerHTML = "Auto Detect" + '<span class="dropdown-svg"><svg><use href="#FxSymbol0-035"></use></svg></span>';
                    }
                }
            }
            input.addEventListener('keyup', function(e) {
                translateText(e.target.value, selectInputWrapper.getAttribute('current-lang'));
            });

            window.addEventListener('click', function (e) {
                if (selectInputWrapper !== e.target && !selectInputWrapper.contains(e.target)) {
                    displayInputArea.classList.remove('open');
                }
            });


        })
        .catch(error => {
            console.error("Error:", error);
        });
};

var styleCode = `
#thai_translation_container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: calc(100% - 60px);
    padding: 20px;
    position: absolute;
    height: calc(100% - 64px);
}

#thai_translation_container>.input-area,
#thai_translation_container>.output-area {
    width: calc(50% - 10px);
    display: flex;
    flex-direction: column;
}
@media (max-width: 640px) {
    #thai_translation_container {
        display: flex;
        flex-direction: column;
    }
    #thai_translation_container>.input-area,
    #thai_translation_container>.output-area {
        width: 100%;
        height: calc(50% - 10px);
    }
}
#thai_translation_container .language-list .single-language {
    padding: 2px 10px;
    font-size: 16px;
    background-color: #f9f9f9;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
    margin: 0 3px;
}

#thai_translation_container .language-list {
    position: relative;
    width: 100%;
    display: flex;
}

#thai_translation_container .language-list .select-wrapper {
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    width: 100%;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    color: #333;
    outline: none;
    cursor: pointer;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

#thai_translation_container .language-list img {
    height: 20px;
    width: 24.5px;
}

#thai_translation_container .language-list .display-area {
    z-index: 10000;
    flex-direction: column;
    position: absolute;
    top: calc(100% + 7px);
    left: 0;
    width: 100%;
    max-height: 400px;
    /* Adjust the max height as needed */
    overflow-y: auto;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    display: none;
}

#thai_translation_container .language-list .single-language.active {
    background: #346fc9;
    color: white;
    border-radius: 5px;
}

#thai_translation_container .language-list .display-area.open {
    display: flex;
}

.dropdown-svg {
    display: flex;
    height: 12px;
    width: 12px;
}
#thai_translation_container textarea {
    border: 0.7px solid #7b7b7b;
    resize: none;
    height: calc(100% - 46px);
    padding: 10px 15px;
    font-size: 16px;
    outline: none;
    border-radius: 5px;
    margin-top:10px;
}
#thai_translation_container > .input-area > span,
#thai_translation_container>.output-area >span  {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 26px;
}
`;

var styleElement = document.createElement('style');
styleElement.textContent = styleCode;

document.querySelector('body').appendChild(styleElement);

