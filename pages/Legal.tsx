import React from 'react';
import { useParams } from 'react-router-dom';

export const Legal = () => {
  const { type } = useParams();
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';
  const updatedDate = 'October 24, 2023';

  return (
    <div className="bg-cream-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
         <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm border border-cream-200">
            <h1 className="text-4xl font-bold text-teal-900 mb-4">{title}</h1>
            <p className="text-stone-400 text-sm mb-12">Last Updated: {updatedDate}</p>
            
            <div className="prose prose-stone prose-lg max-w-none prose-headings:text-teal-900 prose-a:text-teal-600">
               {isPrivacy ? (
                 <>
                   <h3>1. Introduction</h3>
                   <p>BabyBets ("we", "our", "us") is committed to protecting and respecting your privacy. This policy sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed by us.</p>
                   
                   <h3>2. Information We Collect</h3>
                   <p>We may collect and process the following data about you:</p>
                   <ul>
                     <li>Information you provide by filling in forms on our site (name, email, address).</li>
                     <li>Details of transactions you carry out through our site and of the fulfilment of your orders.</li>
                     <li>Details of your visits to our site and the resources that you access.</li>
                   </ul>

                   <h3>3. How We Use Your Information</h3>
                   <p>We use information held about you in the following ways:</p>
                   <ul>
                     <li>To ensure that content from our site is presented in the most effective manner for you.</li>
                     <li>To provide you with information, products or services that you request from us.</li>
                     <li>To notify you about changes to our service.</li>
                     <li>To contact you if you win a prize.</li>
                   </ul>
                 </>
               ) : (
                 <>
                   <h3>1. General</h3>
                   <p>These terms and conditions apply to all competitions listed on the BabyBets website.</p>
                   
                   <h3>2. Qualifying Persons</h3>
                   <p>The competitions are open to all residents of the United Kingdom aged 18 years or over, except employees of BabyBets and their close relatives and anyone otherwise connected with the organisation or judging of the competition.</p>

                   <h3>3. Legal Undertaking</h3>
                   <p>By entering a competition the entrant ('Entrant', 'you', 'your') will be deemed to have legal capacity to do so, you will have read and understood these terms and conditions and you will be bound by them and by any other requirements set out in any related promotional material.</p>

                   <h3>4. Competition Entry</h3>
                   <p>Competitions may be entered via the website. Availability and pricing of competitions is at the discretion of BabyBets and will be specified at the point of sale on the website.</p>
                   
                   <h3>5. Free Postal Entry</h3>
                   <p>To enter any competition for free, you must send your name, address, date of birth, contact number and chosen competition to our registered address. Postal entries are limited to one per person per competition.</p>
                 </>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};