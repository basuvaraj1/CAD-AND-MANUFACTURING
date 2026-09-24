const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Replace with your WhatsApp number.
const STORAGE_KEY = "cadManufacturingLeads";

function waLink(message){
  return "https://wa.me/" + WHATSAPP_NUMBER.replace(/\D/g,"") + "?text=" + encodeURIComponent(message);
}
const msg = "Hello CAD & Manufacturing, I want to discuss a CAD / manufacturing project.";
document.getElementById("heroWhatsapp").href = waLink(msg);
document.getElementById("footerWhatsapp").href = waLink(msg);

const form = document.getElementById("leadForm");
const status = document.getElementById("formStatus");
const file = document.getElementById("file");

file?.addEventListener("change", () => {
  if(file.files[0] && file.files[0].size > 10*1024*1024){
    status.textContent = "File is larger than 10 MB. Please choose a smaller file.";
    file.value = "";
  } else {
    document.getElementById("fileNote").textContent =
      file.files[0] ? `Selected: ${file.files[0].name}` : "Maximum 10 MB in this demo.";
  }
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const fileObj = file?.files?.[0];

  if(fileObj && fileObj.size > 10*1024*1024){
    status.textContent = "Please choose a file below 10 MB.";
    return;
  }

  const lead = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    name: data.get("name"),
    company: data.get("company"),
    email: data.get("email"),
    phone: data.get("phone"),
    service: data.get("service"),
    message: data.get("message"),
    fileName: fileObj ? fileObj.name : ""
  };

  const leads = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  leads.push(lead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

  const whatsappText =
`Hello CAD & Manufacturing,

New website enquiry:
Name: ${lead.name}
Company: ${lead.company || "-"}
Email: ${lead.email}
Phone: ${lead.phone}
Service: ${lead.service}

Requirement:
${lead.message}

${lead.fileName ? "Reference file: " + lead.fileName : "No file attached"}`;

  status.textContent = "Requirement received. Opening WhatsApp...";
  window.open(waLink(whatsappText), "_blank");
  form.reset();
  document.getElementById("fileNote").textContent = "Maximum 10 MB in this demo.";
});
