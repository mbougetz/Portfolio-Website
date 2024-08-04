document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded'); 

    const resume_url = "/assets/Resume.pdf"; // Replace with the path to your PDF
    const default_resume_filename = "Milo-Bougetz-Aulbach-Resume.pdf";

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

    //Displays resume
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.getDocument(resume_url).promise.then(function(pdf) {
        // Fetch the first page
        pdf.getPage(1).then(function(page) {
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });

            // Prepare canvas using PDF page dimensions
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Append canvas to the container
            document.getElementById('pdf-viewer').appendChild(canvas);
 
            // Render PDF page into canvas context
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

    
});