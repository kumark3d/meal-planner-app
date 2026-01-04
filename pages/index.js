// SECURE VERSION - Uses backend API route to protect API key
import React, { useState } from 'react';
import { Calendar, Users, ShoppingCart, Loader2, UtensilsCrossed, ExternalLink } from 'lucide-react';

export default function MealPlanner() {
  const [formData, setFormData] = useState({
    familySize: 2,
    ages: '30, 32',
    dietary: 'none',
    generateDay: 'monday',
    email: '',
    includeBreakfast: true,
    includeLunch: true,
    includeDinner: true
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateMealPlan = async (emailReminders = false) => {
    if (emailReminders && !formData.email) {
      alert('Please enter your email address to receive reminders.');
      return;
    }
    
    setLoading(true);
    try {
      // Build list of meals to include
      const mealsToInclude = [];
      if (formData.includeBreakfast) mealsToInclude.push('breakfast');
      if (formData.includeLunch) mealsToInclude.push('lunch');
      if (formData.includeDinner) mealsToInclude.push('dinner');
      
      if (mealsToInclude.length === 0) {
        alert('Please select at least one meal type.');
        setLoading(false);
        return;
      }

      const prompt = `Create a healthy 7-day meal plan for a family of ${formData.familySize} people (ages: ${formData.ages}). 
      Dietary preference: ${formData.dietary === 'none' ? 'No restrictions' : formData.dietary}.
      ${formData.dietary === 'simple-cooking' ? 'IMPORTANT: All meals must have 15 minutes or less prep time. Focus on quick recipes like salads, sandwiches, wraps, smoothie bowls, one-pot meals, quick stir-fries, and minimal-prep dishes. Avoid recipes requiring marinating, long cooking times, or complex techniques.' : ''}
      ${formData.dietary === 'no-fish' ? 'IMPORTANT: Do not include any fish or seafood in the meal plan.' : ''}
      ${formData.dietary === 'no-red-meat' ? 'IMPORTANT: Do not include beef, pork, lamb, or other red meats. Chicken, turkey, fish, and plant-based proteins are fine.' : ''}
      Include only these meals: ${mealsToInclude.join(', ')}.
      
      IMPORTANT: Include diverse ethnic cuisines throughout the week. Draw from Chinese, Indian, Thai, Japanese, Korean, Mexican, Mediterranean, Middle Eastern, Vietnamese, and other global cuisines. Ensure variety across the 7 days - don't repeat the same cuisine type more than twice in the week.
      
      For each day (Monday-Sunday), provide for each included meal type:
      1. Meal name (include the cuisine type, e.g., "Thai Green Curry", "Indian Butter Chicken")
      2. Brief description (1-2 sentences)
      3. Preparation time in minutes (realistic estimate)
      4. A specific, real recipe URL from reputable cooking websites. Use diverse sources including:
         - General: AllRecipes, Bon Appetit, Serious Eats, NYT Cooking
         - Asian: The Woks of Life, Just One Cookbook, Hebbar's Kitchen, Hot Thai Kitchen, Rak's Kitchen
         - Mexican/Latin: Serious Eats, Rick Bayless, Pati's Mexican Table
         - Middle Eastern/Mediterranean: Ottolenghi, Maureen Abood
         - Multi-cultural: BBC Good Food, Epicurious
      5. Key ingredients
      
      At the end, provide a consolidated grocery list organized by category (Proteins, Vegetables, Fruits, Grains, Dairy, Pantry, Spices & Aromatics).
      IMPORTANT: Include specific quantities for each ingredient based on the family size of ${formData.familySize} people.
      
      Respond ONLY with valid JSON (no markdown formatting, no preamble). Use this exact structure:
      {
        "days": [
          {
            "day": "Monday",
            "meals": {
              ${mealsToInclude.map(meal => `"${meal}": {"name": "...", "description": "...", "prepTime": 30, "recipeUrl": "https://...", "ingredients": ["...", "..."]}`).join(',\n              ')}
            }
          }
        ],
        "groceryList": {
          "Proteins": ["2 lbs chicken breast", "1 lb ground beef"],
          "Vegetables": ["3 large tomatoes", "2 bell peppers"],
          "Fruits": ["6 bananas", "2 lbs apples"],
          "Grains": ["1 box pasta (16 oz)", "2 lbs rice"],
          "Dairy": ["1 gallon milk", "8 oz cheddar cheese"],
          "Spices & Aromatics": ["1 bunch cilantro", "2 inch ginger root", "6 cloves garlic"],
          "Pantry": ["1 bottle olive oil", "salt and pepper", "soy sauce"]
        }
      }`;

      // Call our secure backend API route
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          maxOutputTokens: 4000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const content = data.candidates[0].content.parts[0].text;
      
      // Remove markdown code fences if present
      let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const planData = JSON.parse(cleanContent);
      
      setMealPlan(planData);
      
      // Send email reminders if requested
      if (emailReminders) {
        await sendEmailReminders(planData);
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Failed to generate meal plan. Please try again. Error: ' + error.message);
    }
    setLoading(false);
  };

  const sendEmailReminders = async (planData) => {
    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate a brief confirmation message that weekly meal plan reminders will be sent to ${formData.email} every ${formData.generateDay}. Keep it friendly and concise (2-3 sentences).`,
          maxOutputTokens: 1000,
          temperature: 0.7
        })
      });

      const data = await response.json();
      const confirmationMsg = data.candidates[0].content.parts[0].text;
      
      alert(`Email reminders set up!\n\n${confirmationMsg}\n\nNote: In a production app, this would integrate with an email service like SendGrid or AWS SES to actually send the emails.`);
    } catch (error) {
      console.error('Error setting up email reminders:', error);
      alert('Failed to set up email reminders. Please try again.');
    }
  };

  const formatMealPlanForEmail = (planData) => {
    let emailText = `Weekly Meal Plan\n\n`;
    planData.days.forEach(day => {
      emailText += `${day.day}:\n`;
      Object.entries(day.meals).forEach(([mealType, meal]) => {
        emailText += `  ${mealType}: ${meal.name}\n`;
      });
      emailText += '\n';
    });
    return emailText;
  };

const exportToText = () => {
  let textContent = `WEEKLY MEAL PLAN\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
  
  mealPlan.days.forEach(day => {
    textContent += `${day.day.toUpperCase()}\n${'='.repeat(day.day.length)}\n`;
    Object.entries(day.meals).forEach(([mealType, meal]) => {
      textContent += `\n${mealType.toUpperCase()}: ${meal.name}\n`;
      textContent += `Description: ${meal.description}\n`;
      textContent += `Prep time: ${meal.prepTime} minutes\n`;
      if (meal.recipeUrl) {
        textContent += `Recipe: ${meal.recipeUrl}\n`;
      }
      textContent += `Ingredients: ${meal.ingredients.join(', ')}\n`;
    });
    textContent += '\n';
  });
  
  textContent += '\nSHOPPING LIST\n=============\n';
  Object.entries(mealPlan.groceryList).forEach(([category, items]) => {
    textContent += `\n${category.toUpperCase()}:\n`;
    items.forEach(item => {
      textContent += `  • ${item}\n`;
    });
  });
  
  // Create and download file
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meal-plan-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const exportToCalendar = () => {
  let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Meal Planner//EN\n';
  
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  mealPlan.days.forEach((day, index) => {
    const dayIndex = dayNames.indexOf(day.day);
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + (dayIndex - today.getDay() + 7) % 7);
    
    Object.entries(day.meals).forEach(([mealType, meal]) => {
      const startTime = mealType === 'breakfast' ? '08:00' : 
                       mealType === 'lunch' ? '12:00' : '18:00';
      const endTime = mealType === 'breakfast' ? '09:00' : 
                     mealType === 'lunch' ? '13:00' : '19:00';
      
      const dateStr = eventDate.toISOString().split('T')[0].replace(/-/g, '');
      const startStr = `${dateStr}T${startTime.replace(':', '')}00`;
      const endStr = `${dateStr}T${endTime.replace(':', '')}00`;
      
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `DTSTART:${startStr}\n`;
      icsContent += `DTEND:${endStr}\n`;
      icsContent += `SUMMARY:${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${meal.name}\n`;
      icsContent += `DESCRIPTION:Prep time: ${meal.prepTime} min\\n${meal.recipeUrl || ''}\n`;
      icsContent += `END:VEVENT\n`;
    });
  });
  
  icsContent += 'END:VCALENDAR';
  
  // Create and download file
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meal-plan-${new Date().toISOString().split('T')[0]}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <UtensilsCrossed className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Kumar's AI Meal Planner</h1>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4" />
                Family Size
              </label>
              <input
                type="number"
                min="1"
                value={formData.familySize}
                onChange={(e) => setFormData({...formData, familySize: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Ages
              </label>
              <input
                type="text"
                value={formData.ages}
                onChange={(e) => setFormData({...formData, ages: e.target.value})}
                placeholder="e.g., 5, 7, 35, 37"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Dietary Preferences
              </label>
              <select
                value={formData.dietary}
                onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="none">No restrictions</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-free</option>
                <option value="dairy-free">Dairy-free</option>
                <option value="low-carb">Low-carb</option>
                <option value="simple-cooking">Simple Cooking (under 15 min prep)</option>
                <option value="keto">Keto</option>
                <option value="no-fish">No Fish</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Meals to Include
              </label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeBreakfast}
                    onChange={(e) => setFormData({...formData, includeBreakfast: e.target.checked})}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-700">Breakfast</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeLunch}
                    onChange={(e) => setFormData({...formData, includeLunch: e.target.checked})}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-700">Lunch</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeDinner}
                    onChange={(e) => setFormData({...formData, includeDinner: e.target.checked})}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-700">Dinner</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Generate on Day
              </label>
              <select
                value={formData.generateDay}
                onChange={(e) => setFormData({...formData, generateDay: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
            

          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => generateMealPlan(false)}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-12 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Now'
              )}
            </button>
            
          </div>
        </div>

       {mealPlan && (
  <>
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Weekly Meal Plan</h2>
        <div className="flex gap-3">
          <button
            onClick={exportToText}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            📄 Export to Notes
          </button>
          <button
            onClick={exportToCalendar}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            📅 Add to Calendar
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {mealPlan.days.map((day, idx) => (
          <div key={idx} className="border-l-4 border-green-500 pl-6 py-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{day.day}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(day.meals).map(([mealType, meal]) => (
                <div key={mealType} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-700 capitalize">{mealType}</h4>
                    {meal.name.match(/(Chinese|Indian|Thai|Japanese|Korean|Mexican|Mediterranean|Middle Eastern|Vietnamese|Italian|French|Greek|Spanish|Turkish|Lebanese|Moroccan|Ethiopian)/i) && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                        {meal.name.match(/(Chinese|Indian|Thai|Japanese|Korean|Mexican|Mediterranean|Middle Eastern|Vietnamese|Italian|French|Greek|Spanish|Turkish|Lebanese|Moroccan|Ethiopian)/i)[0]}
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 mb-2">{meal.name}</p>
                  <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                      ⏱️ {meal.prepTime} min
                    </span>
                  </div>
                  
                  {meal.recipeUrl && (
                    
                      href={meal.recipeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm mb-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Recipe
                    </a>
                  )}
                  
                  <div className="text-xs text-gray-500 border-t border-gray-200 pt-2">
                    <span className="font-semibold">Key ingredients:</span>
                    <ul className="mt-1 ml-4 list-disc">
                      {meal.ingredients.slice(0, 3).map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Shopping List</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(mealPlan.groceryList).map(([category, items]) => (
          <div key={category}>
            <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b-2 border-green-500">
              {category}
            </h3>
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </>
)}
  </div>
    </div>
  );
}
