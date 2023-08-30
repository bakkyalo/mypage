window.addEventListener('DOMContentLoaded', function() {
    this.fetch('https://fate.5ch.net/test/read.cgi/lovelive/1693319159/index.html', { mode: 'cors' })
        .then(response => response.text()).then(data => {
            const parser = new DOMParser();
            const html = parser.parseFromString(data, "text/html");
            const dates = html.querySelectorAll('#date');
            for(let d of dates) {
                this.document.getElementById('5ch-dates').appendChild(d);
            }

        })
})