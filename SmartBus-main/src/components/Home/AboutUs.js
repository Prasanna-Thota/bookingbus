import React, { useState } from 'react';

const containerStyle = {
  maxWidth: '1100px', // Adjust as per your design
  margin: '0 auto',
  padding: '20px',
};

const headerStyle = {
  marginBottom: '20px',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 600, // Added font weight
};

const paragraphStyle = {
  fontSize: '1.05rem',
  lineHeight: '1.5',
  marginBottom: '15px',
  fontFamily: 'Montserrat, sans-serif',
  wordSpacing: '6px', // Added word spacing
  opacity: '0.75', // Added opacity
};

export const AboutUs = () => {
  const [showMore, setShowMore] = useState(false);

  const replaceRedBus = (text) => {
    return text.replace(/redBus/g, 'SmartBus');
  };

  // Original content array, adjust the number of paragraphs to display
  const originalContent = [
    `SmartBus is India's largest brand for online bus ticket booking and offers an easy-to-use online bus and train ticket booking; 
    with over 36 million satisfied customers, 3500+ bus operators to choose from, and plenty of offers on bus ticket booking, 
    SmartBus makes road journeys super convenient for travellers. A leading platform for booking bus tickets, SmartBus has been the 
    leader in online bus booking over the past 17 years across thousands of cities and lakhs of routes in India.`,

    `Booking a bus ticket online on the SmartBus app or website is very simple. You can download the SmartBus app or visit redbus.
    in and enter your source, destination & travel date to check the top-rated bus services available. You can then compare bus prices, 
    user ratings & amenities, select your preferred seat, boarding & dropping points and pay using multiple payment options like UPI, 
    debit or credit card, net banking and more. With SmartBus, get assured safe & secure payment methods and guaranteed travel with the 
    best seat and bus operator of your choice. Once the bus booking payment is confirmed, all you have to do is pack your bags and get 
    ready to travel with the m-ticket, which you can show to the bus operator on your mobile before boarding the bus. Online bus ticket 
    booking with SmartBus is that simple!`,

    `SmartBus also offers other exclusive benefits on online bus tickets like flexible ticket rescheduling options, easy & friendly 
    cancellation policies, and instant payment refunds. With a live bus tracking feature, you can plan travel and never miss the bus. 
    You can get the cheapest bus tickets by availing the best discounts for new & existing customers. With redDeals, you can also get
    exclusive & additional discounts on your online bus ticket booking. You will get 24/7 customer support on call, chat & help to 
    resolve all your queries in English & local languages.`,

    `SmartBus offers Primo bus services, specially curated by SmartBus with highly rated buses and best-in-class service. 
    With Primo by SmartBus, you can be assured of safe, comfortable, and on-time bus service at no additional cost. With multiple boarding
    and dropping points available across all major cities in India, you can select at your convenience and enjoy a smooth travel 
    experience.`,

    `SmartBus operates in six countries, including India, Malaysia, Singapore, Indonesia, Peru, and Colombia. Through its website and app, 
    it has sold over 220 million bus tickets worldwide. With over 36 million satisfied customers, SmartBus is committed to providing its 
    users with a world-class online bus booking experience.`,

    `SmartBus offers bus tickets from some of the top private bus operators, such as Orange Travels, VRL Travels, SRS Travels, Chartered Bus, 
    and Praveen Travels, and state government bus operators, such as APSRTC, TSRTC, GSRTC, Kerala RTC, TNSTC, RSRTC, UPSRTC, and more. 
    With SmartBus, customers can easily book bus tickets for different bus types, such as AC/non-AC, Sleeper, Seater, Volvo, Multi-axle, 
    AC Sleeper, Electric buses, and more.`,
  ];

  // Display only the first three paragraphs initially
  const displayedContent = showMore ? originalContent : originalContent.slice(0, 3);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>BOOK BUS TICKETS ONLINE</h1>
      {displayedContent.map((text, index) => (
        <p key={index} style={paragraphStyle}>
          {replaceRedBus(text)}
        </p>
      ))}
      {!showMore && (
        <button onClick={toggleShowMore} style={{ cursor: 'pointer', color: '#007bff', border: 'none', background: 'none' }}>
          Read more
        </button>
      )}
      {showMore && (
        <button onClick={toggleShowMore} style={{ cursor: 'pointer', color: '#007bff', border: 'none', background: 'none' }}>
          Read less
        </button>
      )}
    </div>
  );
};

export default AboutUs;
