fn sum(x: i32, y: i32) -> i32 {
    return x + y;
}

fn main() {
    let x = sum(15, 29);

    {
        let x = 86;
        println!("Inner x = {x}");
    }

    println!("Hello, world! {x}");
}
