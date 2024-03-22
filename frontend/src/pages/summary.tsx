import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CardWithForm() {
  return (
    <div className="w-screen mt-24">
      <span className="flex justify-center text-6xl text-[#023382] font-bold mb-12">
        Your insights
      </span>
      <div className="w-2/3 m-auto">
        <span className="flex justify-center text-4xl text-[#023382] font-bold mb-12">
          Summary
        </span>
        <span className="flex justify-center text-justify text-base text-[#023382] font-light mb-12">
          Medical Report Summary
          <br />
          <br />
          Patient Name: Mr. AVINASH RANJAN
          <br />
          <br />
          Date of Report: 05/01/2021
          <br />
          <br />
          Review of Test Parameters:
          <br />
          <br /> Complete Haemogram (CBC): Assesses various aspects of blood
          cells, including red blood cell count, white blood cell count, and
          platelet count.
          <br /> Kidney Function Test (KFT): Evaluates kidney function by
          measuring levels of urea, uric acid, calcium, and creatinine.
          <br /> Lipid Profile: Measures levels of cholesterol, triglycerides,
          and other fats in the blood.
          <br /> Liver Function Test (LFT): Assesses liver health by measuring
          levels of enzymes and bilirubin.
          <br /> Thyroid Function Test (TSH): Measures levels of
          thyroid-stimulating hormone (TSH), which helps regulate thyroid
          function.
          <br /> Vitamin D Test: Measures levels of vitamin D, which is
          important for bone health.
          <br /> Urine Examination: Evaluates urine pH, specific gravity, and
          presence of protein, glucose, and other substances.
          <br />
          <br />
          Findings:
          <br />
          <br /> CBC: Within normal limits, indicating a healthy number of blood
          cells.
          <br /> KFT: All parameters are within normal ranges, suggesting normal
          kidney function.
          <br /> Lipid Profile: Total cholesterol and LDL cholesterol are
          slightly elevated, while HDL cholesterol is low. These findings
          indicate a higher risk of cardiovascular disease.
          <br /> LFT: SGOT and SGPT levels are elevated, indicating inflammation
          or liver damage. Bilirubin levels are slightly elevated but within the
          acceptable range.
          <br /> Thyroid Function Test: TSH levels are within normal limits,
          indicating a normal functioning thyroid gland.
          <br /> Vitamin D Test: Vitamin D levels are deficient, indicating a
          need for supplementation.
          <br /> Urine Examination: pH and specific gravity are within normal
          ranges. No protein, glucose, or other abnormalities were detected.
          <br />
          <br />
          Implications:
          <br />
          <br /> The elevated cholesterol and low HDL cholesterol levels
          increase the risk of heart and blood vessel problems.
          <br /> The elevated liver enzymes indicate liver inflammation or
          damage.
          <br /> The deficient vitamin D levels may result in bone and muscle
          weakness.
          <br />
          <br />
          Recommendations:
          <br />
          <br /> Discuss the lipid profile results with a healthcare
          professional to determine if lifestyle changes or medication are
          necessary to manage cholesterol levels.
          <br /> Seek medical attention to determine the cause of the elevated
          liver enzymes and receive appropriate treatment.
          <br /> Increase vitamin D intake through diet or supplements as
          recommended by a healthcare professional.
          <br />
          <br />
          Additional Notes:
          <br />
          <br />
          It is important to note that these results provide a snapshot of your
          health at the time of testing. Your healthcare provider may order
          additional tests or recommend lifestyle changes based on these
          findings. It is essential to follow the advice of your healthcare
          provider and attend regular checkups to maintain your overall
          well-being.
        </span>
        <span className="flex justify-center text-4xl text-[#023382] font-bold mb-12">
          Advice
        </span>
        <span className="flex justify-center text-justify text-base text-[#023382] font-light mb-12">
          The report shows that the patient has a slightly elevated ESR
          (Erythrocyte Sedimentation Rate) of 23. Although this is within the
          normal range (2-20 mm/hr), it is slightly higher than the ideal range
          of 0-15 mm/hr. A slightly elevated ESR can be an indicator of
          inflammation or infection in the body.
          <br />
          <br />
          Considering the slightly elevated ESR, it would be advisable for the
          patient to visit another doctor for further evaluation. The doctor may
          order additional tests or physical examinations to determine the
          underlying cause of the elevated ESR.
          <br />
          <br />
          Possible causes of elevated ESR include:
          <br />
          <br />
          Infections (bacterial, viral, or parasitic)
          <br /> Inflammatory conditions (such as arthritis or inflammatory
          bowel disease)
          <br /> Autoimmune disorders
          <br /> Certain types of cancer
          <br /> Pregnancy
          <br /> Recent surgery or trauma
          <br />
          <br />
          It's important to note that a slightly elevated ESR alone is not
          enough to make a diagnosis. The doctor will consider the patient's
          symptoms, medical history, and other test results to determine the
          appropriate course of action.
        </span>
        <span className="flex justify-center text-4xl text-[#023382] font-bold mb-12">
          Food Veg
        </span>
        <span className="flex justify-center text-justify text-base text-[#023382] font-light mb-12">
          Dietary Recommendations for Managing Mr. Avinash Ranjan's Health
          Conditions
          <br />
          <br />
          General Recommendations:
          <br />
          <br />- Prioritize whole, unprocessed foods rich in nutrients like
          fruits, vegetables, whole grains, and lean protein.
          <br />- Limit processed foods, sugary drinks, and unhealthy fats.
          <br />- Stay well-hydrated by drinking plenty of water throughout the
          day.
          <br />- Engage in regular physical activity as recommended by your
          healthcare professional.
          <br />
          <br />
          Condition-Specific Recommendations:
          <br />
          <br />
          Hyperlipidemia (High Cholesterol)
          <br />
          <br />- Foods to include:
          <br /> - Oatmeal, brown rice, quinoa, and other whole grains
          <br /> - Fruits and vegetables, especially leafy greens, berries, and
          avocados
          <br /> - Lean protein sources like fish, chicken, tofu, and legumes
          <br /> - Nuts and seeds
          <br /> - Olive oil and avocado oil
          <br />
          <br />- Foods to limit or avoid:
          <br /> - Fatty meats, processed meats, and high-fat dairy products
          <br /> - Fried foods and fast food
          <br /> - Sugary drinks and sodas
          <br /> - Excessive amounts of alcohol
          <br />
          <br />
          Hyperglycemia (High Blood Sugar)
          <br />
          <br />- Foods to include:
          <br /> - Non-starchy vegetables, such as broccoli, cauliflower, and
          leafy greens
          <br /> - Fruits in moderation
          <br /> - Whole grains, such as brown rice, quinoa, and oatmeal
          <br /> - Lean protein sources, such as fish, chicken, and beans
          <br /> - Healthy fats, such as olive oil and avocado oil
          <br />
          <br />- Foods to limit or avoid:
          <br /> - Sugary foods and drinks
          <br /> - White bread, pasta, and rice
          <br /> - Processed foods
          <br /> - Foods high in saturated and trans fats
          <br />
          <br />
          Strictly Vegetarian Indian Diet Recommendations for Optimal Health
          <br />
          <br />- Foods to include:
          <br />
          <br /> - Cereals and Millets: Brown rice, quinoa, oats, whole wheat
          bread, ragi, and jowar
          <br /> - Pulses and Legumes: Lentils, beans, chickpeas, and peas
          <br /> - Vegetables: Leafy greens, broccoli, cauliflower, carrots,
          tomatoes, onions, and potatoes
          <br /> - Fruits: Bananas, apples, oranges, berries, and mangoes
          <br /> - Dairy Products: Milk, yogurt, and cheese (in moderation)
          <br /> - Nuts and Seeds: Almonds, walnuts, chia seeds, and flaxseeds
          <br /> - Oils: Olive oil, canola oil, and coconut oil
          <br />
          <br />- Foods to limit or avoid:
          <br />
          <br /> - Fried Foods: Samosas, pakoras, and deep-fried delicacies
          <br /> - Sugary Foods: Sweets, pastries, and carbonated drinks
          <br /> - Processed Foods: Instant noodles, packaged snacks, and
          processed meats
          <br /> - Refined Grains: White bread, white rice, and refined flour
          products
          <br /> - Excessive Amounts of Oil: Avoid excessive use of oil in
          cooking to limit saturated fat intake
        </span>
        <span className="flex justify-center text-4xl text-[#023382] font-bold mb-12">
          Food Non Veg
        </span>
        <span className="flex justify-center text-justify text-base text-[#023382] font-light mb-12">
          Dietary Recommendations for Mr. AVINASH RANJAN<br /><br />Based on the
          provided medical report, the following dietary modifications are
          recommended:<br /><br />Foods to Include:<br /><br /> Fruits: Apples,
          bananas, oranges, berries, etc. (rich in vitamins, minerals, and
          antioxidants)<br /> Vegetables: Leafy greens (spinach, kale),
          broccoli, cauliflower, carrots, etc. (rich in fiber, vitamins, and
          minerals)<br /> Whole grains: Brown rice, quinoa, oats, etc. (provide
          fiber, vitamins, and minerals)<br /> Lean protein: Chicken, fish,
          beans, tofu, etc. (supply essential amino acids and support
          satiety)<br /> Healthy fats: Olive oil, avocados, fatty fish (salmon,
          tuna), nuts, etc. (provide essential fatty acids)<br /><br />Foods to Avoid
          or Limit:<br /><br /> Sugary drinks: Soda, juice, sports drinks, etc.
          (high in calories, sugar, and contribute to weight gain)<br />
          Processed foods: Packaged snacks, frozen meals, etc. (often high
          in sodium, unhealthy fats, and preservatives)<br /> Red meat:
          Consumption in moderation (due to saturated fat content)<br /> Fried
          foods: Limit intake (high in unhealthy fats and calories)<br />
          Refined carbohydrates: White bread, pasta, pastries, etc. (low in
          nutrients and contribute to blood sugar spikes)<br /><br />Specific
          Considerations for Non-Vegetarian:<br /><br /> Include a variety of lean
          protein sources: Poultry, fish, eggs, beans, lentils, tofu, etc.<br />
          Limit saturated fat intake: Choose lean cuts of meat, remove
          visible fat, and grill, bake, or steam instead of frying.<br />
          Emphasize plant-based foods: Incorporate fruits, vegetables, and
          whole grains into meals to balance protein intake.<br /><br />Additional
          Recommendations:<br /><br /> Hydrate adequately: Drink plenty of water
          throughout the day.<br /> Eat regular meals: Consume three main meals
          and healthy snacks to avoid blood sugar fluctuations.<br /> Cook meals
          at home: This allows for greater control over ingredients and
          portion sizes.<br /> Consider consulting a registered dietitian: For
          personalized guidance and support in optimizing nutrition.
        </span>
      </div>
    </div>
  );
}
