export default class Validator {
  public static checkEmail(emailForCheck: string): string {
    // Проверка на наличие начальных или конечных пробелов
    if (emailForCheck.trim() !== emailForCheck) {
      return "The address contains leading or trailing spaces.";
    }
    // Проверка правильности формата email
    const emailPattern = /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(emailForCheck)) {
      return "The email address is in an invalid format!";
    }
    // возвращаем пустую строку, если с адресом всё в порядке
    return "";
  }

  public static checkPassword(passwordForCheck: string): string {
    // Проверка на наличие начальных или конечных пробелов
    if (passwordForCheck.trim() !== passwordForCheck) {
      return "The password must not contain leading or trailing spaces!";
    }
    // Проверка длины пароля
    if (passwordForCheck.length < 8) {
      return "The password must be at least 8 characters long!";
    }
    // Проверка на наличие заглавной буквы
    if (!/[A-Z]/.test(passwordForCheck)) {
      return "The password must contain at least one capital letter (A–Z)!";
    }
    // Проверка на наличие строчной буквы
    if (!/[a-z]/.test(passwordForCheck)) {
      return "The password must contain at least one lowercase letter (a–z)!";
    }
    // Проверка на наличие цифры
    if (!/\d/.test(passwordForCheck)) {
      return "The password must contain at least one digit (0-9)!";
    }
    // Проверка на наличие специального символа
    if (!/[!#$%&*@^]/.test(passwordForCheck)) {
      return "The password must contain at least one special character (e.g. !@#$%^&*)!";
    }
    // возвращаем пустую строку, если с паролем всё в порядке
    return "";
  }

  // Проверка имени и фамилии имеют одинаковые критерии по ТЗ
  public static checkNameOrLastName(nameForCheck: string): string {
    // Проверка на наличие хотя бы одного символа
    if (nameForCheck.trim().length === 0) {
      return "Username must contain at least one character!";
    }
    // Проверка на наличие специальных символов и цифр
    if (/[^A-Za-zЁА-яё]/.test(nameForCheck)) {
      return "The username must not contain numbers or special characters!";
    }
    // возвращаем пустую строку, если с именем/фамилией всё в порядке
    return "";
  }

  // Здесь установлено условие, чтобы пользователь был не младше 16 лет
  public static checkBirthDate(BirthDateForCheck: string): string {
    const birthDate = new Date(BirthDateForCheck);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    // Проверяем, исполнилось ли 16 лет
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      if (age < 16) {
        return "The user is under 16 years of age!";
      } else {
        return "";
      }
    }
    if (age >= 16) {
      return "";
    } else {
      return "The user is under 16 years of age!";
    }
  }

  public static checkStreet(streetForCheck: string): string {
    // Проверка на наличие хотя бы одного символа
    if (streetForCheck.trim().length === 0) {
      return "Street name must contain at least one character!";
    }
    // возвращаем пустую строку, если с названием улицы всё в порядке
    return "";
  }

  public static checkCity(cityForCheck: string): string {
    // Проверка на наличие хотя бы одного символа
    if (cityForCheck.trim().length === 0) {
      return "City name must contain at least one character!";
    }
    // Проверка на наличие специальных символов и цифр
    if (/[^A-Za-zЁА-яё]/.test(cityForCheck)) {
      return "The city name must not contain numbers or special characters!";
    }
    // возвращаем пустую строку, если с названием города всё в порядке
    return "";
  }

  public static checkIndexRussia(indexForCheck: string): string {
    // Проверка формата индекса для России
    if (!/^\d{6}$/.test(indexForCheck)) {
      return "The postal code does not match the format for Russia!";
    }
    // возвращаем пустую строку, если с индексом всё в порядке
    return "";
  }

  public static checkIndexUSA(indexForCheck: string): string {
    // Проверка формата индекса для США
    if (!/^\d{5}(-\d{4})?$/.test(indexForCheck)) {
      return "The postal code does not match the format for USA!";
    }
    // возвращаем пустую строку, если с индексом всё в порядке
    return "";
  }

  public static checkCountry(countryForCheck: string): string {
    if (countryForCheck !== "Russia" && countryForCheck !== "USA") {
      return "Please enter a valid country!";
    }
    // возвращаем пустую строку, если со страной всё в порядке
    return "";
  }
}
