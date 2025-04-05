export const LANGUAGE_VERSIONS = {
  javascript: '18.15.0',
  typescript: '5.0.3',
  python: '3.10.0',
  java: '15.0.2',
  csharp: '6.12.0',
  cpp: '10.2.0',
  go: '1.16.2',
  rust: '1.68.2',
  ruby: '3.0.1',
  php: '8.2.3',
  swift: '5.3.3',
  kotlin: '1.8.20',
  scala: '3.2.2',
};

export const CODE_BOILER_PLATE = {
  javascript: `// JavaScript Example
console.log('Hello, World!');

function greet(name) {
  return \`Hello, \${name}!\`;
}

const result = greet('Developer');
console.log(result);
`,

  typescript: `// TypeScript Example
interface Person {
  name: string;
  age: number;
}

function greet(person: Person): string {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

const user: Person = {
  name: 'Developer',
  age: 30
};

console.log(greet(user));
`,

  python: `# Python Example
def greet(name):
    return f"Hello, {name}!"

result = greet("Developer")
print(result)

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        return f"My name is {self.name} and I am {self.age} years old."

person = Person("Developer", 30)
print(person.introduce())
`,

  java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");

        Person person = new Person("Developer", 30);
        System.out.println(person.introduce());
    }
}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String introduce() {
        return "My name is " + name + " and I am " + age + " years old.";
    }
}
`,

  csharp: `// C# Example
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");

        var person = new Person("Developer", 30);
        Console.WriteLine(person.Introduce());
    }
}

class Person {
    public string Name { get; }
    public int Age { get; }

    public Person(string name, int age) {
        Name = name;
        Age = age;
    }

    public string Introduce() {
        return $"My name is {Name} and I am {Age} years old.";
    }
}
`,

  cpp: `// C++ Example
#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    Person(std::string name, int age) : name(name), age(age) {}

    std::string introduce() {
        return "My name is " + name + " and I am " + std::to_string(age) + " years old.";
    }
};

int main() {
    std::cout << "Hello, World!" << std::endl;

    Person person("Developer", 30);
    std::cout << person.introduce() << std::endl;

    return 0;
}
`,

  go: `// Go Example
package main

import (
	"fmt"
)

type Person struct {
	Name string
	Age  int
}

func (p Person) Introduce() string {
	return fmt.Sprintf("My name is %s and I am %d years old.", p.Name, p.Age)
}

func main() {
	fmt.Println("Hello, World!")

	person := Person{Name: "Developer", Age: 30}
	fmt.Println(person.Introduce())
}
`,

  rust: `// Rust Example
struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: &str, age: u32) -> Self {
        Person {
            name: name.to_string(),
            age,
        }
    }

    fn introduce(&self) -> String {
        format!("My name is {} and I am {} years old.", self.name, self.age)
    }
}

fn main() {
    println!("Hello, World!");

    let person = Person::new("Developer", 30);
    println!("{}", person.introduce());
}
`,

  ruby: `# Ruby Example
class Person
  attr_reader :name, :age

  def initialize(name, age)
    @name = name
    @age = age
  end

  def introduce
    "My name is #{name} and I am #{age} years old."
  end
end

puts "Hello, World!"

person = Person.new("Developer", 30)
puts person.introduce
`,

  php: `<?php
// PHP Example
class Person {
    private $name;
    private $age;

    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }

    public function introduce() {
        return "My name is " . $this->name . " and I am " . $this->age . " years old.";
    }
}

echo "Hello, World!\n";

$person = new Person("Developer", 30);
echo $person->introduce() . "\n";
?>`,

  swift: `// Swift Example
class Person {
    let name: String
    let age: Int

    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }

    func introduce() -> String {
        return "My name is \(name) and I am \(age) years old."
    }
}

print("Hello, World!")

let person = Person(name: "Developer", age: 30)
print(person.introduce())
`,

  kotlin: `// Kotlin Example
class Person(val name: String, val age: Int) {
    fun introduce(): String {
        return "My name is $name and I am $age years old."
    }
}

fun main() {
    println("Hello, World!")

    val person = Person("Developer", 30)
    println(person.introduce())
}
`,

  scala: `// Scala Example
class Person(val name: String, val age: Int) {
  def introduce(): String = {
    s"My name is $name and I am $age years old."
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    println("Hello, World!")

    val person = new Person("Developer", 30)
    println(person.introduce())
  }
}
`, 
};
