$(document).on('knack-view-render.view_1', function(event, view, data) {
    var $self = $(this);
  
    // Setting some global variables (IDs of these will need to be changed depending on the View)
    var $passwordComplexity = $self.find('#kn-input-field_4');
    var $passwordLength = $self.find('#view_1-field_5');
    var $passwordInputContainer = $self.find('#kn-input-field_3');
    var $passwordInput = $self.find('#field_3');
    
    // Helper function for generating a random string
    function generateRandom(charset, length) {
      var retVal = "";    
      for (var i = 0, n = charset.length; i < length; ++i) {
          retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      
      return retVal;
    }
    
    // Helper function for shuffling the characters
    function shuffleString(s) {
        var arr = s.split('');
    
        return arr.sort(function() {
          return 0.5 - Math.random();
        }).join('');	
    }
    
    // Main function for generating the password
    function getNewPassword() {    
      // Getting the password length from dropdown
      var length = $passwordLength.val();
      
      // Getting the password complexity options
      var includeUppercase = $passwordComplexity.find('input[value="Include Uppercase"]').is(':checked');
      var includeNumbers = $passwordComplexity.find('input[value="Include Numbers"]').is(':checked');
      var includeSymbols = $passwordComplexity.find('input[value="Include Symbols"]').is(':checked');
      var excludeAmbigousChars = $passwordComplexity.find('input[value="Exclude Ambiguous Characters"]').is(':checked');
      
      
      // Characters that can be used when trying to avoid chars that could be easily confused: !#%+23456789:=?@ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz
      // we use these when 'Exclude Ambiguous Characters' checkbox is checked
      var simplePasswLowercase = 'abcdefghijkmnopqrstuvwxyz';
      var simplePasswUppercase = 'ABCDEFGHJKLMNPRSTUVWXYZ';
      var simplePasswNumbers = '23456789';
      var simplePasswSymbols = '!#%+:=?@';
              
      // All symbols that can be used in passwords
      var complexPasswSymbols = '!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~';
      
      // Alphabet characters
      var alphabet = 'abcdefghijklmnopqrstuvwxyz';
      
      if (!includeUppercase && !includeNumbers && !includeSymbols && !excludeAmbigousChars) {
        return generateRandom(alphabet, length);
      } else {
        // 60% of the password should be other character than simple alphabet letter, calculate the distributions based on selected options
        var totalSelectedOptions = Number(includeUppercase) + Number(includeNumbers) + Number(includeSymbols);
        var percentageToBeUsed = 0;
        switch (totalSelectedOptions) {
          case 1:
            percentageToBeUsed = 60;
            break;
          case 2:
            percentageToBeUsed = 30;
            break;
          case 3:
            percentageToBeUsed = 20;
            break;
          default: 
            percentageToBeUsed = 0;
        }     
        
        var calculatedPercentage = Math.round(length/100 * percentageToBeUsed);
        
        var uppercaseNeeded = includeUppercase ? calculatedPercentage : 0;            
        var numbersNeeded = includeNumbers ? calculatedPercentage : 0;            
        var symbolsNeeded = includeSymbols ? calculatedPercentage : 0;      
        
        var normalCharsNeeded = length - uppercaseNeeded - numbersNeeded - symbolsNeeded;
        
        var normalChars = '',
            uppercaseChars = '',
            numberChars = '',
            symbolChars = '';
        
        normalChars = generateRandom(excludeAmbigousChars ? simplePasswLowercase : alphabet, normalCharsNeeded);
          
        if (uppercaseNeeded > 0) {
          uppercaseChars = generateRandom(excludeAmbigousChars ? simplePasswUppercase : alphabet.toUpperCase(), uppercaseNeeded);
        }
  
        if (numbersNeeded > 0) {
          numberChars = generateRandom(excludeAmbigousChars ? simplePasswNumbers : '0123456789', numbersNeeded);
        }
  
        if (symbolsNeeded > 0) {
          symbolChars = generateRandom(excludeAmbigousChars ? simplePasswSymbols : complexPasswSymbols, symbolsNeeded);
        } 
        
        return shuffleString(normalChars + uppercaseChars + numberChars + symbolChars);
        
      }    
    }
    
    
    // Adding Regenerate button to HTML structure
    $passwordInputContainer.append('<button id="password-regenerate-btn">Regenerate</button>');
    
    // Event Handlers
    $('#password-regenerate-btn').on('click', function(e) {
      $passwordInput.val(getNewPassword());
      e.preventDefault();
    });
  
    $passwordComplexity.on('change', function(e) { $passwordInput.val(getNewPassword()) });
    $passwordLength.on('change', function(e) { $passwordInput.val(getNewPassword()) });  
  });