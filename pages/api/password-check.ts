//password strength
export const enum PasswordCheckStrength {
    Short,
    Common,
    Weak,
    Okay,
    Strong,
};

//Object to check password strengths and various properties
export class PasswordChecker {

    //expect length of all passwords
    public static get MinimumLength(): number {
        return 5;
    }

    //Regex to check for a common password string - all based on 5+ length passwords
    private commonPasswords = /passw.*|12345.*|09876.*|qwerty.*|password.*|iloveyou.*|admin.*|root.*|toor.*/;


    //Checks if the given password matches a set of common passwords

    public isCommonPassword(password: string): boolean {
        return this.commonPasswords.test(password);
    }

    //returns the strength of the password
    public checkPasswordStrength(password: string): PasswordCheckStrength {
        

        //build up the strength of the passwords
        let numberOfElements = 0;
        numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Lowercase letters
        numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Uppercase letters
        numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;      // Numbers
        numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;   // Special characters (inc. space)

        //Assuming that we have a poor password
        let currentPasswordStrength = PasswordCheckStrength.Short;

        //check the strength of this password using some rules
        if (password === null || password.length < PasswordChecker.MinimumLength) {
            currentPasswordStrength = PasswordCheckStrength.Short;
        }   
        else if (this.isCommonPassword(password) === true) {
            currentPasswordStrength = PasswordCheckStrength.Common;
        }   
        else if (numberOfElements === 0 || numberOfElements === 1 || numberOfElements === 2) {
            currentPasswordStrength = PasswordCheckStrength.Weak;
        }   
        else if (numberOfElements === 3) {
            currentPasswordStrength = PasswordCheckStrength.Okay;
        }   
        else {
            currentPasswordStrength = PasswordCheckStrength.Strong;
        }

        //Return the current password strength
        return currentPasswordStrength;
    }
}
