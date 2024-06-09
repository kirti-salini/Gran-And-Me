const sampleListings = [
  {
    title: 'Anjali Kumari, Licensed Physical Therapist',
    description: 'Specializes in physical rehabilitation and post-surgical recovery, focusing on elderly patients. Over 12 years of experience in various healthcare settings.\r\n' +
      '            \r\n' +
      '            ',
    image:{
      filename:"listingimage",
      url: 'https://t4.ftcdn.net/jpg/05/00/43/17/360_F_500431770_2lKBDeRtclz26vbaaIddDXc4pKdYo2Wa.jpg',
    },
    mobileno: 9876543210,
    price: 1000,
    location: 'Delhi, Delhi',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [77.2090, 28.6139] // Example coordinates for Delhi
    }
  },
  {
    title: 'Priya Malhotra, Professional In-Home Nurse',
    description: 'Registered nurse providing in-home care for chronically ill patients, with expertise in managing medications, wound care, and daily medical routines.\r\n' +
      '            ',
    image:{
        filename:"listingimage",
        url: 'https://t4.ftcdn.net/jpg/04/33/00/51/360_F_433005115_s06ud3ewiAQsHjSkX8AbG19ON651hpnQ.jpg',
    },
    mobileno: 9123456789,
    price: 1200,
    location: 'Kolkata, West Bengal',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [88.3639, 22.5726] // Example coordinates for Kolkata
    }
  },
  {
    title: 'Akash Singh, Certified Dementia Care Specialist',
    description: 'Certified to work with dementia patients, focusing on creating a supportive environment that adapts to the needs of individuals with memory loss.',
    image:{
      filename:"listingimage",
      url: 'https://i.ytimg.com/vi/rHC5QlAVlk0/maxresdefault.jpg',
    },
    mobileno: 9234567890,
    price: 900,
    location: 'Chennai, Tamil Nadu',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [80.2707, 13.0827] // Example coordinates for Chennai
    }
  },
  {
    title: 'Ravi Gupta, Specialized Elder Caregiver',
    description: ' Dedicated to providing compassionate care for elderly patients, specializing in mobility assistance and daily living activities. With 10 years of experience, Ravi is known for his patience and attentiveness.',
    image:{
      filename:"listingimage",
      url:'https://qph.cf2.quoracdn.net/main-qimg-b4ea9b0d8bc55d78e6bb9f31a7eda340-lq',
    },
    mobileno: 9345678901,
    price: 850,
    location: 'Pune, Maharashtra',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [73.8567, 18.5204] // Example coordinates for Pune
    }
  },
  {
    title: 'Lakshmi Reddy, Pediatric Nurse',
    description: 'Certified pediatric nurse with a focus on providing medical care to children from infancy through adolescence. Lakshmi offers home visits and is skilled in managing acute and chronic conditions in young patients.',
    image:{
      filename:"listingimage",
      url: 'https://childrensheartlink.org/wp-content/uploads/2020/03/Hamalatha-and-baby1-1024x681.jpg',
    },
    mobileno: 9456789012,
    price: 950,
    location: 'Hyderabad, Telangana',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [78.4867, 17.3850] // Example coordinates for Hyderabad
    }
  },
  {
    title: 'Rohit Patel, Home Healthcare Aide',
    description: 'Rohit assists patients with daily activities, medication management, and light household duties. He is particularly skilled in caring for post-operative patients and those undergoing rehabilitation.',
    image:{
      filename:"listingimage",
      url: 'https://techcrunch.com/wp-content/uploads/2015/09/portea-provides-home-healthcare-across-24-cities-in-india-and-4-in-malaysia.jpg?w=1024',
    },
    mobileno: 9567890123,
    price: 700,
    location: 'Ahmedabad, Gujarat',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [72.5714, 23.0225] // Example coordinates for Ahmedabad
    }
  },
  {
    title: 'Manoj Choudhary, Hospice Care Specialist',
    description: ' Manoj provides end-of-life care with dignity and respect, ensuring comfort and support not only for the patient but also for their families. His empathetic approach and experience in palliative care make him a valued caregiver.\r\n' +
      '            ',
    image:{
      filename:"listingimage",
      url: 'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2F535S16a/MediaObjects/41586_2016_Article_BF535S16a_Figa_HTML.jpg',
    },
    mobileno: 9678901234,
    price: 1100,
    location: 'Jaipur, Rajasthan',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [75.7873, 26.9124] // Example coordinates for Jaipur
    }
  },
  {
    title: 'Suresh Kumar, Disability Support Worker',
    description: 'Specializing in caring for individuals with physical and intellectual disabilities, Suresh adapts environments and activities to meet individual needs, promoting independence and inclusion.',
    image:{
      filename:"listingimage",
      url: 'https://bl-i.thgim.com/public/opinion/7pa0kh/article25040699.ece/alternates/FREE_1200/BL26THINK2RAMP1',
    },
    mobileno: 9789012345,
    price: 800,
    location: 'Coimbatore, Tamil Nadu',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [76.9558, 11.0168] // Example coordinates for Coimbatore
    }
  },
  {
    title: 'Divya Sharma, Mental Health Nurse',
    description: 'Divya is a trained mental health nurse who provides support and care to patients dealing with mental health issues, offering therapy sessions and crisis intervention in home settings.',
    image:{
      filename:"listingimage",
      url: 'https://www.povertyactionlab.org/sites/default/files/styles/full_evaluation_image/public/2023-04/Evaluation%202624_Indian-nurse-examining-patient_shutterstock.jpg?itok=QCOYaTp0',
    },
    mobileno: 9890123456,
    price: 1000,
    location: 'Kolkata, West Bengal',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [88.3639, 22.5726] // Example coordinates for Kolkata
    }
  },
  {
    title: 'Sunita Das, Experienced Childcare Provider',
    description: 'Loving and reliable nanny with 8 years of experience with newborns and toddlers. Trained in early childhood development and emergency response.\r\n' +
      '            ',
    image:{
      filename:"listingimage",
      url:'https://www.shutterstock.com/image-photo/mother-child-rural-village-salunkwadi-600nw-577285297.jpg',
    },
    mobileno: 9901234567,
    price: 750,
    location: 'Bangalore, Karnataka',
    country: 'India',
    geometry: {
      type: 'Point',
      coordinates: [77.5946, 12.9716] // Example coordinates for Bangalore
    }
  }
];

module.exports = { data: sampleListings };
