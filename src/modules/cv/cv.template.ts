export const buildCVTemplate = (data: any) => {
    return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial;
            padding: 40px;
            color: #222;
          }
  
          h1 {
            font-size: 28px;
          }
  
          h2 {
            margin-top: 20px;
            font-size: 20px;
          }
  
          ul {
            padding-left: 20px;
          }
  
          .skills span {
            display: inline-block;
            margin-right: 10px;
            background: #eee;
            padding: 5px 10px;
            border-radius: 5px;
          }
        </style>
      </head>
  
      <body>
  
        <h1>${data.name || "Candidate"}</h1>
  
        <p>${data.headline}</p>
  
        <h2>Summary</h2>
        <p>${data.summary}</p>
  
        
       <h2>Experience</h2>

<ul>
${data.experience
            .map(
                (exp: any) => `
      <li>
        <strong>${exp.title}</strong> - ${exp.company} (${exp.dates})
        <ul>
          ${exp.description
                        .map((d: string) => `<li>${d}</li>`)
                        .join("")}
        </ul>
      </li>
    `
            )
            .join("")}
</ul>
        <h2>Projects</h2>
  
        <ul>
        ${data.projects
          .map(
            (p: any) => `
            <li>
              <strong>${p.title}</strong>
        
              <p>${p.description}</p>
        
              ${
                p.github
                  ? `<p><strong>GitHub:</strong> ${p.github}</p>`
                  : ""
              }
        
              ${
                p.liveLink
                  ? `<p><strong>Live:</strong> ${p.liveLink}</p>`
                  : ""
              }
        
              <small>
                ${p.technologies?.join(", ") || ""}
              </small>
            </li>
          `
          )
          .join("")}
        </ul>
        <h2>Skills</h2>
  
        <div class="skills">
          ${data.skills
            .map((skill: string) => `<span>${skill}</span>`)
            .join("")}
        </div>
  

        <h2>Education</h2>

<ul>
  ${data.education
            ?.map(
                (edu: any) => `
      <li>
        <strong>${edu.institution}</strong><br/>
        ${edu.degree}<br/>
        ${edu.dates}
      </li>
    `
            )
            .join("")}
</ul>

        <h2>Achievements</h2>

<ul>
  ${data.achievements?.length
            ? data.achievements
                .map((a: string) => `<li>${a}</li>`)
                .join("")
            : "<li>No achievements listed</li>"
        }
</ul>
  
      </body>
    </html>
    `;
};