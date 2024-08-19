document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded'); 

    const resume_url = "assets/Resume.pdf";
    const default_resume_filename = "Milo-Bougetz-Aulbach-Resume.pdf";
    const repo_name = "/Portfolio-Website/";

    //Sets the base url according to the environment
    var base = document.createElement('base');
    var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    base.href = isLocal ? '/' : repo_name;
    document.head.appendChild(base);

    //Handle initial hash
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1); //Remove '#'
        document.querySelector(`#${targetId}`)?.scrollIntoView();
    }

    //Handle hash changes
    window.addEventListener("hashchange", () => {
        const targetId = location.hash.substring(1); //Remove '#'
        document.querySelector(`#${targetId}`)?.scrollIntoView();
    });


    //Add functionality to the nav buttons to show/hide the corresponding pages
    let nav_buttons = document.getElementsByClassName("nav_button");
    let pages = document.getElementsByClassName("page");
    for(let curr_button of nav_buttons){
        curr_button.addEventListener("click", function(){
            //Get the corresponding id of the page pointed to by the clicked on nav button
            let button_id = "";
            switch(curr_button.id){
                case "home_button":
                    button_id = "home";
                    break;
                case "projects_button":
                    button_id = "projects";
                    break;
                case "resume_button":
                    button_id = "resume";
                    break;
                case "contact_button":
                    button_id = "contact";
                    break;
                default:
                    console.error("Page not found!");
            }

            //Show the clicked on page and hide all other pages
            if(button_id.length > 0){
                document.getElementById(button_id).hidden = false;
                for(let page of pages){
                    if(page.id != button_id) page.hidden = true;
                }
            }

        });
    }

    //!!!!!!!!!!!!!! init_page is null on page first load and resume doesn't load until the page is reloaded

    //Loads the correct page based on current URL fragment on DOM load
    let fragment = window.location.hash.substring(1);
    if(fragment.length != 0){
        let init_page = document.getElementById(fragment + "_button");
        if(init_page != null) init_page.click();
    }
    

    //Displays resume
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.getDocument(resume_url).promise.then(function(pdf) {
        //Get the first page
        pdf.getPage(1).then(function(page) {
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });

            //Set canvas dimension according to page layout
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            //Add canvas to the resume viewer section
            document.getElementById('pdf-viewer').appendChild(canvas);
 
            //Render resume PDF
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
    });

    //Add print button functionality
    document.getElementById('print-button').addEventListener('click', function() {
        //Uses default browser behavior
        window.open(resume_url, '_blank');
    });

    document.getElementById('download-button').addEventListener('click', function() {
        const link = document.createElement('a');
        link.href = resume_url;

        //Set default filename
        link.download = default_resume_filename;
        link.click();
    });

    //Initialize EmailJS
    emailjs.init("W-kPSoT9RxGzCts70");

    //Handle form submission
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        //Prevent the default form submission
        event.preventDefault(); 

        const form = event.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        //Send email 
        emailjs.send('service_2s1ecpl', 'template_y7psd2t', data)
            .then(response => {
                document.getElementById('responseMessage').innerText = 'Message sent successfully!';
                //Reset form fields upon successful send
                form.reset(); 
            })
            .catch(error => {
                document.getElementById('responseMessage').innerText = 'Failed to send message.';
                console.error('Error sending email:', error);
            });
    });
});