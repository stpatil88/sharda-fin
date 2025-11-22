import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Chandrakant Bawiskar',
      role: 'Business Owner',
      location: 'Kopargaon, Maharashtra',
      rating: 5,
      text: 'Sharada Financial Services has been instrumental in helping me plan my investments. Their SIP recommendations have helped me build a solid portfolio. The team is knowledgeable and always available to answer my queries.',
      image: '👨‍💼'
    },
    {
      id: 2,
      name: 'Hemanth Surale',
      role: 'Software Engineer',
      location: 'Ontorio, Canada',
      rating: 5,
      text: 'I opened my Demat account through Sharada Financial Services and the process was seamless. The guidance on mutual funds and SIP investments has been excellent. Highly recommend their services!',
      image: '👩‍💻'
    },
    {
      id: 3,
      name: 'Mandar Vahadne',
      role: 'Professor',
      location: 'Pune, Maharashtra',
      rating: 5,
      text: 'As someone new to investing, I was hesitant at first. But the team at Sharada Financial Services patiently explained everything and helped me start my investment journey. Their Fixed Deposit calculator helped me plan my savings perfectly.',
      image: '👨‍🏫'
    },
    {
      id: 4,
      name: 'Priyanka Patil',
      role: 'MBA Finance',
      location: 'Kolhapur, Maharashtra',
      rating: 5,
      text: 'I wanted to invest for my children\'s education. The team helped me understand SIP and created a perfect investment plan. The regular updates and market insights are very helpful.',
      image: '👩'
    },
    {
      id: 5,
      name: 'Manoj Narode Patil',
      role: 'Business Owner',
      location: 'Kopargaon, Maharashtra',
      rating: 5,
      text: 'Professional service and excellent financial advice. The market news and analysis provided by Sharada Financial Services keeps me informed about market trends. Great platform for investors!',
      image: '👨‍⚕️'
    },
    {
      id: 6,
      name: 'Dr Deepak Pagare',
      role: 'Cancer Specialist',
      location: 'Kopargaon, Maharashtra',
      rating: 5,
      text: 'I appreciate the transparency and professionalism of Sharada Financial Services. Their calculators are accurate and the investment recommendations are well-researched. A trustworthy financial partner.',
      image: '👩‍💼'
    },
    {
      id: 7,
      name: 'Keyur Mushrif',
      role: 'Software Engineer',
      location: 'New York, USA',
      rating: 5,
      text: 'Sharada Financial Services has been a great help in managing my investments. The team is knowledgeable and always available to answer my questions. I highly recommend their services!',
      image: '👩‍💼'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by thousands of investors across Maharashtra. Read what our satisfied clients have to say about their experience.
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="card relative">
            <Quote className="absolute top-6 right-6 w-12 h-12 text-primary-200 opacity-50" />
            
            <div className="flex items-start space-x-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
                {currentTestimonial.image}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary-400 text-secondary-400" />
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {currentTestimonial.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentTestimonial.role} • {currentTestimonial.location}
                </p>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed italic">
              "{currentTestimonial.text}"
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={prevTestimonial}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-50 transition-colors border border-gray-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-50 transition-colors border border-gray-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* All Testimonials Grid (Desktop) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              onClick={() => goToTestimonial(index)}
              className={`card cursor-pointer transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-2 ring-primary-500 shadow-xl scale-105'
                  : 'hover:shadow-lg hover:scale-102'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-xs text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary-400 text-secondary-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

