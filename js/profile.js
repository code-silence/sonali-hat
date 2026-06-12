// --- Dynamic Active Menu Switcher ---
document.querySelectorAll(".sidebar-menu li a").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (this.classList.contains("logout-btn")) return;
    document.querySelectorAll(".sidebar-menu li").forEach((li) => {
      li.classList.remove("active");
    });
    this.parentElement.classList.add("active");
    if (window.innerWidth <= 992) {
      toggleSidebar();
    }
  });
});

// Profile tab switch korar function
function switchProfileTab(event, tabId) {
  const panels = document.querySelectorAll(".profile-tab-panel");
  panels.forEach((panel) => {
    panel.classList.remove("active-panel");
    panel.classList.add("hidden-panel");
  });
  const tabButtons = document.querySelectorAll(".tab-nav-btn");
  tabButtons.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(tabId).classList.remove("hidden-panel");
  document.getElementById(tabId).classList.add("active-panel");
  event.currentTarget.classList.add("active");
}

// User avatar device theke niye live preview dekhano
function previewAvatar(inputElement) {
  const file = inputElement.files[0];
  if (file) {
    const previewUrl = URL.createObjectURL(file);
    document.getElementById("avatarPreview").src = previewUrl;
    document.getElementById("userAvatar").src = previewUrl;
    showToast(
      "ছবি লোড হয়েছে",
      "প্রোফাইল ছবি সফলভাবে প্রিভিউ করা হয়েছে।",
      "success",
    );
  }
}

// Location Data (Shortened for brevity - keep your full location data here)
const locationData = {
  ঢাকা: {
    ঢাকা: [
      "সাভার",
      "ধামরাই",
      "কেরানীগঞ্জ",
      "নবাবগঞ্জ",
      "দোহার",
      "তেজগাঁও",
      "মিরপুর",
      "গুলশান",
      "উত্তরা",
      "ধানমন্ডি",
      "মতিঝিল",
    ],
    গাজীপুর: ["গাজীপুর সদর", "কালিয়াকৈর", "কাপাসিয়া", "শ্রীপুর", "কালীগঞ্জ"],
    নারায়ণগঞ্জ: [
      "নারায়ণগঞ্জ সদর",
      "বন্দর",
      "আড়াইহাজার",
      "সোনারগাঁও",
      "রূপগঞ্জ",
    ],
    টাঙ্গাইল: [
      "টাঙ্গাইল সদর",
      "সখীপুর",
      "বাসাইল",
      "মধুপুর",
      "ঘাটাইল",
      "কালিহাতী",
      "নাগরপুর",
      "মির্জাপুর",
      "গোপালপুর",
      "দেলদুয়ার",
      "ভূঞাপুর",
      "ধনবাড়ী",
    ],
    কিশোরগঞ্জ: [
      "কিশোরগঞ্জ সদর",
      "হোসেনপুর",
      "পাকুন্দিয়া",
      "কটিয়াদী",
      "ভৈরব",
      "বাজিতপুর",
      "কুলিয়ারচর",
      "করিমগঞ্জ",
      "তাড়াইল",
      "ইটনা",
      "মিঠামইন",
      "অষ্টগ্রাম",
      "নিকলী",
    ],
    মানিকগঞ্জ: [
      "মানিকগঞ্জ সদর",
      "সিঙ্গাইর",
      "শিবালয়",
      "সাটুরিয়া",
      "হরিরামপুর",
      "ঘিওর",
      "দৌলতপুর",
    ],
    মুন্সীগঞ্জ: [
      "মুন্সীগঞ্জ সদর",
      "শ্রীনগর",
      "সিরাজদীখান",
      "লৌহজং",
      "টংগীবাড়ী",
      "গজারিয়া",
    ],
    নরসিংদী: ["নরসিংদী সদর", "বেলাবো", "মনোহরদী", "শিবপুর", "রায়পুরা", "পলাশ"],
    ফরিদপুর: [
      "ফরিদপুর সদর",
      "বোয়ালমারী",
      "আলফাডাঙ্গা",
      "মধুখালী",
      "ভাঙ্গা",
      "নগরকান্দা",
      "চরভদ্রাসন",
      "সদরপুর",
      "সালথা",
    ],
    গোপালগঞ্জ: [
      "গোপালগঞ্জ সদর",
      "মুকসুদপুর",
      "কাশিয়ানী",
      "কোটালীপাড়া",
      "টুঙ্গিপাড়া",
    ],
    মাদারীপুর: ["মাদারীপুর সদর", "শিবচর", "কালকিনি", "রাজৈর", "ডাসার"],
    রাজবাড়ী: [
      "রাজবাড়ী সদর",
      "গোয়ালন্দ",
      "পাংশা",
      "বালিয়াকান্দি",
      "কালুখালী",
    ],
    শরীয়তপুর: [
      "শরীয়তপুর সদর",
      "জাজিরা",
      "নড়িয়া",
      "ভেদরগঞ্জ",
      "ডামুড্যা",
      "গোসাইরহাট",
    ],
  },
  চট্টগ্রাম: {
    চট্টগ্রাম: [
      "চট্টগ্রাম সদর",
      "ফটিকছড়ি",
      "হাটহাজারী",
      "সীতাকুণ্ড",
      "মিরসরাই",
      "বোয়ালখালী",
      "পটিয়া",
      "চন্দনাইশ",
      "সাতকানিয়া",
      "লোহাগাড়া",
      "বাঁশখালী",
      "রাঙ্গুনিয়া",
      "সন্দ্বীপ",
      "রাউজান",
    ],
    কক্সবাজার: [
      "কক্সবাজার সদর",
      "টেকনাফ",
      "উখিয়া",
      "রামু",
      "মহেশখালী",
      "কুতুবদিয়া",
      "পেকুয়া",
      "চকোরিয়া",
    ],
    কুমিল্লা: [
      "কুমিল্লা সদর",
      "লাকসাম",
      "দাউদকান্দি",
      "চান্দিনা",
      "মুরাদনগর",
      "হোমনা",
      "দেবীদ্বার",
      "ব্রাহ্মণপাড়া",
      "বুড়িচং",
      "বরুড়া",
      "নাঙ্গলকোট",
      "তিতাস",
      "মেঘনা",
      "মনোহরগঞ্জ",
      "সদর দক্ষিণ",
    ],
    ব্রাহ্মণবাড়িয়া: [
      "ব্রাহ্মণবাড়িয়া সদর",
      "আশুগঞ্জ",
      "সরাইল",
      "নাসিরনগর",
      "নবীনগর",
      "বাঞ্ছারামপুর",
      "কসবা",
      "আখাউড়া",
      "বিজয়নগর",
    ],
    চাঁদপুর: [
      "চাঁদপুর সদর",
      "ফরিদগঞ্জ",
      "হাজীগঞ্জ",
      "শাহরাস্তি",
      "কচুয়া",
      "মতলব উত্তর",
      "মতলব দক্ষিণ",
      "হাইমচর",
    ],
    নোয়াখালী: [
      "নোয়াখালী সদর",
      "বেগমগঞ্জ",
      "চাটখিল",
      "কোম্পানীগঞ্জ",
      "সেনবাগ",
      "হাতিয়া",
      "কবিরহাট",
      "সোনাইমুড়ী",
      "সুবর্ণচর",
    ],
    ফেনী: [
      "ফেনী সদর",
      "দাগনভূঞা",
      "সোনাগাজী",
      "ছাগলনাইয়া",
      "পরশুরাম",
      "ফুলগাজী",
    ],
    লক্ষ্মীপুর: ["লক্ষ্মীপুর সদর", "রামগঞ্জ", "রায়পুর", "কমলনগর", "রামগতি"],
    বান্দরবান: [
      "বান্দরবান সদর",
      "থানচি",
      "রুমা",
      "রোয়াংছড়ি",
      "লামা",
      "আলীকদম",
      "নাইক্ষ্যংছড়ি",
    ],
    খাগড়াছড়ি: [
      "খাগড়াছড়ি সদর",
      "দীঘিনালা",
      "পানছড়ি",
      "মহালছড়ি",
      "মাটিরাঙ্গা",
      "গুইমারা",
      "মানিকছড়ি",
      "রামগড়",
      "লক্ষ্মীছড়ি",
    ],
    রাঙ্গামাটি: [
      "রাঙ্গামাটি সদর",
      "কাপ্তাই",
      "কাউখালী",
      "বাঘাইছড়ি",
      "বরকল",
      "লংগদু",
      "রাজস্থলী",
      "বিলাইছড়ি",
      "জুরাছড়ি",
      "নানিয়ারচর",
    ],
  },
  রাজশাহী: {
    রাজশাহী: [
      "রাজশাহী সদর",
      "গোদাগাড়ী",
      "তানোর",
      "মোহনপুর",
      "বাগমারা",
      "দুর্গাপুর",
      "বাঘা",
      "চারঘাট",
      "পবা",
    ],
    বগুড়া: [
      "বগুড়া সদর",
      "শিবগঞ্জ",
      "শাজাহানপুর",
      "শেরপুর",
      "ধুনট",
      "সোনাতলা",
      "গাবতলী",
      "সারিয়াকান্দি",
      "দুপচাঁচিয়া",
      "আদমদীঘি",
      "কাহালু",
      "নন্দীগ্রাম",
    ],
    নওগাঁ: [
      "নওগাঁ সদর",
      "পত্নীতলা",
      "মহাদেবপুর",
      "মান্দা",
      "নিয়ামতপুর",
      "আত্রাই",
      "রাণীনগর",
      "বদলগাছী",
      "সাপাহার",
      "পোরশা",
      "ধামইরহাট",
    ],
    নাটোর: [
      "নাটোর সদর",
      "সিংড়া",
      "বড়াইগ্রাম",
      "গুরুদাসপুর",
      "লালপুর",
      "বাগাতিপাড়া",
      "নলডাঙ্গা",
    ],
    চাঁপাইনবাবগঞ্জ: [
      "চাঁপাইনবাবগঞ্জ সদর",
      "শিবগঞ্জ",
      "গোমস্তাপুর",
      "নাচোল",
      "ভোলাহাট",
    ],
    পাবনা: [
      "পাবনা সদর",
      "ঈশ্বরদী",
      "সাঁথিয়া",
      "সুজানগর",
      "বেড়া",
      "চাটমোহর",
      "ফরিদপুর",
      "ভাঙ্গুরা",
      "আটঘরিয়া",
    ],
    সিরাজগঞ্জ: [
      "সিরাজগঞ্জ সদর",
      "শাহজাদপুর",
      "বেলকুচি",
      "কামারখন্দ",
      "রায়গঞ্জ",
      "তাড়াশ",
      "উল্লাপাড়া",
      "কাজীপুর",
      "চৌহালী",
    ],
    জয়পুরহাট: ["জয়পুরহাট সদর", "পাঁচবিবি", "আক্কেলপুর", "কালাই", "ক্ষেতলাল"],
  },
  খুলনা: {
    খুলনা: [
      "খুলনা সদর",
      "ডুমুরিয়া",
      "বটিয়াঘাটা",
      "দাকোপ",
      "ফুলতলা",
      "দিঘলিয়া",
      "কয়রা",
      "তেরখাদা",
      "রূপসা",
    ],
    যশোর: [
      "যশোর সদর",
      "অভয়নগর",
      "ঝিকরগাছা",
      "চৌগাছা",
      "মণিরামপুর",
      "কেশবপুর",
      "শার্শা",
      "বাঘারপাড়া",
    ],
    সাতক্ষীরা: [
      "সাতক্ষীরা সদর",
      "আশাশুনি",
      "শ্যামনগর",
      "কালিগঞ্জ",
      "তালা",
      "কলারোয়া",
      "দেবহাটা",
    ],
    বাগেরহাট: [
      "বাগেরহাট সদর",
      "মোংলা",
      "মোড়েলগঞ্জ",
      "শরণখোলা",
      "কচুয়া",
      "ফকিরহাট",
      "রামপাল",
      "চিতলমারী",
      "মোল্লাহাট",
    ],
    কুষ্টিয়া: [
      "কুষ্টিয়া সদর",
      "কুমারখালী",
      "খোকসা",
      "মিরপুর",
      "ভেড়ামারা",
      "দৌলতপুর",
    ],
    ঝিনাইদহ: [
      "ঝিনাইদহ সদর",
      "শৈলকুপা",
      "হরিণাকুণ্ডু",
      "কালীগঞ্জ",
      "কোটচাঁদপুর",
      "মহেশপুর",
    ],
    চুয়াডাঙ্গা: ["চুয়াডাঙ্গা সদর", "আলমডাঙ্গা", "দামুড়হুদা", "জীবননগর"],
    মেহেরপুর: ["মেহেরপুর সদর", "গাংনী", "মুজিবনগর"],
    মাগুরা: ["মাগুরা সদর", "শ্রীপুর", "শালিখা", "মহম্মদপুর"],
    নড়াইল: ["নড়াইল সদর", "কালিয়া", "লোহাগড়া"],
  },
  সিলেট: {
    সিলেট: [
      "সিলেট সদর",
      "বিয়ানীবাজার",
      "গোলাপগঞ্জ",
      "কোম্পানীগঞ্জ",
      "জৈন্তাপুর",
      "গোয়াইনঘাট",
      "কানাইঘাট",
      "জকিগঞ্জ",
      "বিশ্বনাথ",
      "ওসমানী নগর",
      "দক্ষিণ সুরমা",
      "বালাগঞ্জ",
      "ফেঞ্চুগঞ্জ",
    ],
    সুনামগঞ্জ: [
      "সুনামগঞ্জ সদর",
      "ছাতক",
      "দোয়ারাবাজার",
      "দিরাই",
      "শাল্লা",
      "তাহিরপুর",
      "বিশ্বম্ভরপুর",
      "জামালগঞ্জ",
      "ধর্মপাশা",
      "মধ্যনগর",
      "শান্তিগঞ্জ",
    ],
    হবিগঞ্জ: [
      "হবিগঞ্জ সদর",
      "নবীগঞ্জ",
      "বানিয়াচং",
      "আজমিরীগঞ্জ",
      "চুনারুঘাট",
      "মাধবপুর",
      "বাহুবল",
      "লাখাই",
      "শায়েস্তাগঞ্জ",
    ],
    মৌলভীবাজার: [
      "মৌলভীবাজার সদর",
      "শ্রীমঙ্গল",
      "কমলগঞ্জ",
      "কুলাউড়া",
      "বড়লেখা",
      "জুড়ী",
      "রাজনগর",
    ],
  },
  বরিশাল: {
    বরিশাল: [
      "বরিশাল সদর",
      "বাকেরগঞ্জ",
      "বাবুগঞ্জ",
      "উজিরপুর",
      "বানারীপাড়া",
      "গৌরনদী",
      "আগৈলঝাড়া",
      "মেহেন্দিগঞ্জ",
      "মুলাদী",
      "হিজলা",
    ],
    পটুয়াখালী: [
      "পটুয়াখালী সদর",
      "বাউফল",
      "গলাচিপা",
      "দশমিনা",
      "মির্জাগঞ্জ",
      "কলাপাড়া",
      "দুমকি",
      "রাঙ্গাবালী",
    ],
    ভোলা: [
      "ভোলা সদর",
      "দৌলতখান",
      "বোরহানউদ্দিন",
      "তজুমদ্দিন",
      "লালমোহন",
      "চরফ্যাশন",
      "মনপুরা",
    ],
    পিরোজপুর: [
      "পিরোজপুর সদর",
      "ভান্ডারিয়া",
      "মঠবাড়িয়া",
      "ইন্দুরকানী",
      "কাউখালী",
      "নেছারাবাদ (স্বরূপকাঠী)",
      "নাজিরপুর",
    ],
    বরগুনা: ["বরগুনা সদর", "আমতলী", "পাথরঘাটা", "বেতাগী", "বামনা", "তালতলী"],
    ঝালকাঠি: ["ঝালকাঠি সদর", "নলছিটি", "রাজাপুর", "কাঠালিয়া"],
  },
  রংপুর: {
    রংপুর: [
      "রংপুর সদর",
      "গঙ্গাচড়া",
      "তারাগঞ্জ",
      "বদরগঞ্জ",
      "মিঠাপুকুর",
      "পীরগঞ্জ",
      "কাউনিয়া",
      "পীরগাছা",
    ],
    দিনাজপুর: [
      "দিনাজপুর সদর",
      "চিরিরবন্দর",
      "পার্বতীপুর",
      "বীরগঞ্জ",
      "নবাবগঞ্জ",
      "বিরামপুর",
      "হাকিমপুর",
      "ফুলবাড়ী",
      "বোচাগঞ্জ",
      "কাহারোল",
      "ঘোড়াঘাট",
      "খানসামা",
      "বিরল",
    ],
    গাইবান্ধা: [
      "গাইবান্ধা সদর",
      "সাদুল্লাপুর",
      "পলাশবাড়ী",
      "গোবিন্দগঞ্জ",
      "সুন্দরগঞ্জ",
      "সাঘাটা",
      "ফুলছড়ি",
    ],
    কুড়িগ্রাম: [
      "কুড়িগ্রাম সদর",
      "নাগেশ্বরী",
      "ভুরুঙ্গামারী",
      "ফুলবাড়ী",
      "রাজারহাট",
      "উলিপুর",
      "চিলমারী",
      "রৌমারী",
      "চর রাজিবপুর",
    ],
    নীলফামারী: [
      "নীলফামারী সদর",
      "সৈয়দপুর",
      "জলঢাকা",
      "কিশোরগঞ্জ",
      "ডোমার",
      "ডিমলা",
    ],
    লালমনিরহাট: [
      "লালমনিরহাট সদর",
      "আদিতমারী",
      "কালীগঞ্জ",
      "হাতীবান্ধা",
      "পাটগ্রাম",
    ],
    ঠাকুরগাঁও: [
      "ঠাকুরগাঁও সদর",
      "পীরগঞ্জ",
      "বালিয়াডাঙ্গী",
      "হরিপুর",
      "রাণীশংকৈল",
    ],
    পঞ্চগড়: ["পঞ্চগড় সদর", "বোদা", "দেবীগঞ্জ", "তেঁতুলিয়া", "আটোয়ারী"],
  },
  ময়মনসিংহ: {
    ময়মনসিংহ: [
      "ময়মনসিংহ সদর",
      "মুক্তাগাছা",
      "ভালুকা",
      "ত্রিশাল",
      "গৌরীপুর",
      "ঈশ্বরগঞ্জ",
      "নান্দাইল",
      "ফুলবাড়িয়া",
      "ফুলপুর",
      "হালুয়াঘাট",
      "ধোবাউড়া",
      "তারাখান্দা",
    ],
    জামালপুর: [
      "জামালপুর সদর",
      "মেলান্দহ",
      "ইসলামপুর",
      "দেওয়ানগঞ্জ",
      "সরিষাবাড়ী",
      "মাদারগঞ্জ",
      "বকশীগঞ্জ",
    ],
    নেত্রকোনা: [
      "নেত্রকোনা সদর",
      "বারহাট্টা",
      "কেন্দুয়া",
      "মদন",
      "মোহনগঞ্জ",
      "কলমাকান্দা",
      "দুর্গাপুর",
      "পূর্বধলা",
      "আটপাড়া",
      "খালিয়াজুরী",
    ],
    শেরপুর: ["শেরপুর সদর", "নকলা", "নালিতাবাড়ী", "ঝিনাইগাতী", "শ্রীবরদী"],
  },
};

const divisionSelect = document.getElementById("divisionSelect");
if (divisionSelect) {
  for (let division in locationData) {
    let option = document.createElement("option");
    option.value = division;
    option.text = division;
    divisionSelect.appendChild(option);
  }
}

function loadDistricts() {
  const division = document.getElementById("divisionSelect").value;
  const districtSelect = document.getElementById("districtSelect");
  const upazilaSelect = document.getElementById("upazilaSelect");

  districtSelect.innerHTML =
    '<option value="" disabled selected>জেলা নির্বাচন করুন</option>';
  upazilaSelect.innerHTML =
    '<option value="" disabled selected>আগে জেলা নির্বাচন করুন</option>';
  upazilaSelect.disabled = true;

  if (division) {
    districtSelect.disabled = false;
    const districts = locationData[division];
    for (let district in districts) {
      let option = document.createElement("option");
      option.value = district;
      option.text = district;
      districtSelect.appendChild(option);
    }
  }
}

function loadUpazilas() {
  const division = document.getElementById("divisionSelect").value;
  const district = document.getElementById("districtSelect").value;
  const upazilaSelect = document.getElementById("upazilaSelect");

  upazilaSelect.innerHTML =
    '<option value="" disabled selected>উপজেলা/থানা নির্বাচন করুন</option>';

  if (division && district) {
    upazilaSelect.disabled = false;
    const upazilas = locationData[division][district];
    upazilas.forEach(function (upazila) {
      let option = document.createElement("option");
      option.value = upazila;
      option.text = upazila;
      upazilaSelect.appendChild(option);
    });
  }
}

function toggleProfilePassword(iconElement) {
  const passwordInput = iconElement.previousElementSibling;
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    iconElement.classList.remove("fa-eye");
    iconElement.classList.add("fa-eye-slash");
    iconElement.style.color = "#2d6a4f";
  } else {
    passwordInput.type = "password";
    iconElement.classList.remove("fa-eye-slash");
    iconElement.classList.add("fa-eye");
    iconElement.style.color = "#95a5a6";
  }
}

// Animated Toast Notification
function showToast(title, message, type = "success") {
  const toast = document.getElementById("dynamicToast");
  const titleEl = document.getElementById("toastTitle");
  const textEl = document.getElementById("toastText");
  const iconEl = document.getElementById("toastIcon");

  if (!toast) return;

  titleEl.innerText = title;
  textEl.innerText = message;

  if (type === "success") {
    iconEl.className = "fa-solid fa-circle-check toast-icon";
    iconEl.style.color = "#2d6a4f";
    toast.style.borderLeftColor = "#2d6a4f";
  } else if (type === "error") {
    iconEl.className = "fa-solid fa-circle-xmark toast-icon";
    iconEl.style.color = "#d32f2f";
    toast.style.borderLeftColor = "#d32f2f";
  } else if (type === "info") {
    iconEl.className = "fa-solid fa-circle-info toast-icon";
    iconEl.style.color = "#1976d2";
    toast.style.borderLeftColor = "#1976d2";
  }

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ==================================================
// Image Compression Helper Function
// ==================================================
// এই ফাংশনটি অরিজিনাল ছবিকে ওয়েবের জন্য পারফেক্ট সাইজ ও কোয়ালিটিতে কনভার্ট করবে
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // ছবির রেশিও (Aspect Ratio) ঠিক রেখে সাইজ ছোট করা
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // ক্যানভাসে ছবি ড্র করা
        ctx.drawImage(img, 0, 0, width, height);

        // ক্যানভাস থেকে কম্প্রেসড Blob (ফাইল) তৈরি করা (0.8 মানে 80% কোয়ালিটি, যা চোখে একদম অরিজিনাল লাগবে)
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          quality,
        );
      };
    };
  });
}
// ==================================================
// ImgBB API দিয়ে ছবি আপলোড করার ফাংশন
// ==================================================
async function uploadImageToImgBB(imageFile) {
  // আপনার ImgBB API Key
  const IMGBB_API_KEY = "50e321961cde194d90cbf941cd472015";

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();
    if (data.success) {
      return data.data.url; // ImgBB থেকে পাওয়া ছবির লাইভ লিংক
    } else {
      throw new Error("ছবি আপলোড ফেইল হয়েছে");
    }
  } catch (error) {
    console.error("ImgBB Error:", error);
    return null;
  }
}

// ==================================================
// ফায়ারবেসে ডেটা এবং ImgBB-এর ছবি সেভ করার মেইন লজিক
// ==================================================
async function saveProfileChanges(event) {
  event.preventDefault();

  if (!window.firebaseDb || !window.firebaseAuth) {
    showToast("এরর!", "ফায়ারবেস কানেক্ট হয়নি। পেজ রিফ্রেশ দিন।", "error");
    return;
  }

  const user = window.firebaseAuth.currentUser;
  if (!user) {
    showToast("সতর্কতা!", "আপনাকে আগে লগইন করতে হবে।", "error");
    return;
  }

  const form = event.target;
  const parentTab = form.closest(".profile-tab-panel").id;
  let updateData = {};

  try {
    if (parentTab === "basicInfoTab") {
      const inputs = form.querySelectorAll("input");
      updateData = {
        name: inputs[0].value.trim(),
        email: inputs[1].value.trim(),
        phone: inputs[2].value.trim(),
      };

      // --- ImgBB তে ছবি আপলোডের লজিক ---
      const avatarInput = document.getElementById("avatarInput");
      if (avatarInput && avatarInput.files.length > 0) {
        showToast("অপেক্ষা করুন", "আপনার ছবি আপলোড হচ্ছে...", "info");

        const imageFile = avatarInput.files[0];

        // ImgBB তে ছবি পাঠিয়ে লাইভ লিংক নিয়ে আসা
        const liveImageUrl = await uploadImageToImgBB(imageFile);

        if (liveImageUrl) {
          updateData.photoURL = liveImageUrl; // ডেটাবেসে শুধু লিংকটা সেভ হবে
        } else {
          showToast("এরর!", "ছবি আপলোড হতে সমস্যা হয়েছে।", "error");
          return;
        }
      }
    } else if (parentTab === "addressTab") {
      const selects = form.querySelectorAll("select");
      const inputs = form.querySelectorAll("input");
      updateData = {
        division: selects[0].value,
        district: selects[1].value,
        upazila: selects[2].value,
        village: inputs[0].value.trim(),
      };
    } else if (parentTab === "paymentTab") {
      const inputs = form.querySelectorAll("input");
      updateData = {
        bkash: inputs[0].value.trim(),
        nagad: inputs[1].value.trim(),
      };
    } else if (parentTab === "securityTab") {
      showToast("দুঃখিত!", "পাসওয়ার্ড আপডেট ফিচারটি শীঘ্রই আসছে!", "info");
      return;
    }

    // ডেটাবেসে (Firestore) ইনফরমেশন পাঠানো
    const userRef = window.firebaseDoc(window.firebaseDb, "users", user.uid);
    await window.firebaseSetDoc(userRef, updateData, { merge: true });

    showToast(
      "সংরক্ষিত হয়েছে!",
      "আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে।",
      "success",
    );

    // সেভ হওয়ার সাথে সাথে ড্রয়ার ও পেজে লেটেস্ট ডেটা দেখানোর জন্য
    if (typeof loadLatestUserData === "function") {
      loadLatestUserData();
    }
  } catch (error) {
    console.error("Firebase Error: ", error);
    showToast("ব্যর্থ!", "ডেটা সেভ হতে সমস্যা হয়েছে।", "error");
  }
}

// ==================================================
// Profile Slide Drawer & Auto-Fill Forms Logic
// ==================================================

// ড্রয়ার খোলার ফাংশন
function openProfileDrawer() {
  const drawer = document.getElementById("profileDrawer");
  const overlay = document.getElementById("drawerOverlay");
  if (drawer && overlay) {
    drawer.classList.add("open");
    overlay.classList.add("active");
    loadLatestUserData(); // ড্রয়ার খুললেও যেন ফ্রেশ ডেটা আসে
  }
}

// ড্রয়ার বন্ধ করার ফাংশন
function closeProfileDrawer() {
  const drawer = document.getElementById("profileDrawer");
  const overlay = document.getElementById("drawerOverlay");
  if (drawer && overlay) {
    drawer.classList.remove("open");
    overlay.classList.remove("active");
  }
}

// টপবারের প্রোফাইল ছবিতে ক্লিক করলে ড্রয়ার ওপেন করার ইভেন্ট লিসেনার
const topbarAvatar = document.getElementById("userAvatar");
if (topbarAvatar) {
  topbarAvatar.style.cursor = "pointer";
  topbarAvatar.addEventListener("click", openProfileDrawer);
}

// ফায়ারবেস থেকে ডেটা এনে ড্রয়ার এবং ইনপুট ফর্মে অটো-ফিল করার ফাংশন
async function loadLatestUserData() {
  if (
    !window.firebaseDb ||
    !window.firebaseAuth ||
    !window.firebaseGetDoc ||
    !window.firebaseDoc
  ) {
    console.log("Firebase is still initializing...");
    return;
  }

  const user = window.firebaseAuth.currentUser;
  if (!user) return;

  try {
    const userRef = window.firebaseDoc(window.firebaseDb, "users", user.uid);
    const docSnap = await window.firebaseGetDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // --------------------------------------------------
      // ক. স্লাইড ড্রয়ার এবং টপবার আপডেট করা
      // --------------------------------------------------
      if (document.getElementById("drawerName"))
        document.getElementById("drawerName").innerText =
          data.name || "নাম সেট করা নেই";
      if (document.getElementById("drawerEmail"))
        document.getElementById("drawerEmail").innerText =
          data.email || user.email;
      if (document.getElementById("drawerPhone"))
        document.getElementById("drawerPhone").innerText =
          data.phone || "নম্বর দেওয়া নেই";

      const userRoleText =
        data.role === "buyer" ? "ক্রেতা (Buyer)" : "কৃষক (Seller)";
      if (document.getElementById("drawerRole"))
        document.getElementById("drawerRole").innerText = userRoleText;
      if (document.getElementById("roleBadge"))
        document.getElementById("roleBadge").innerText = userRoleText;

      // ঠিকানা প্রিপেয়ার করা
      let fullAddress = "ঠিকানা দেওয়া নেই";
      if (data.village && data.upazila && data.district) {
        fullAddress = `${data.village}, ${data.upazila}, ${data.district}`;
      }
      if (document.getElementById("drawerAddress"))
        document.getElementById("drawerAddress").innerText = fullAddress;

      // পেমেন্ট মেথড
      if (document.getElementById("drawerBkash"))
        document.getElementById("drawerBkash").innerText =
          data.bkash || "সেট করা নেই";
      if (document.getElementById("drawerNagad"))
        document.getElementById("drawerNagad").innerText =
          data.nagad || "সেট করা নেই";

      // প্রোফাইল পিকচার সব জায়গায় লাইভ করা
      if (data.photoURL) {
        if (document.getElementById("drawerAvatar"))
          document.getElementById("drawerAvatar").src = data.photoURL;
        if (document.getElementById("userAvatar"))
          document.getElementById("userAvatar").src = data.photoURL;
        if (document.getElementById("avatarPreview"))
          document.getElementById("avatarPreview").src = data.photoURL;
      }

      // --------------------------------------------------
      // খ. পেজের ভেতরের ইনপুট ফর্মগুলো অটোমেটিক পূরণ করা
      // --------------------------------------------------
      // ১. সাধারণ তথ্য ফর্ম
      const basicInputs = document.querySelectorAll("#basicInfoTab form input");
      if (basicInputs.length >= 3) {
        basicInputs[0].value = data.name || "";
        basicInputs[1].value = data.email || user.email;
        basicInputs[2].value = data.phone || "";
      }

      // ২. ঠিকানা ও লোকেশন ফর্ম
      if (data.division) {
        document.getElementById("divisionSelect").value = data.division;
        loadDistricts(); // জেলা লোড করার কাস্টম ফাংশন কল
        if (data.district) {
          document.getElementById("districtSelect").value = data.district;
          loadUpazilas(); // উপজেলা লোড করার কাস্টম ফাংশন কল
          if (data.upazila) {
            document.getElementById("upazilaSelect").value = data.upazila;
          }
        }
      }
      const villageInput = document.querySelector("#addressTab form input");
      if (villageInput) {
        villageInput.value = data.village || "";
      }

      // ৩. পেমেন্ট সেটিংস ফর্ম
      const paymentInputs = document.querySelectorAll("#paymentTab form input");
      if (paymentInputs.length >= 2) {
        paymentInputs[0].value = data.bkash || "";
        paymentInputs[1].value = data.nagad || "";
      }
    }
  } catch (error) {
    console.error("Firestore থেকে ডেটা লোড করতে সমস্যা হয়েছে:", error);
  }
}
