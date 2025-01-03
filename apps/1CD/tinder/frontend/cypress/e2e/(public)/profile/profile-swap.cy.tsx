/// <reference types="cypress" />

describe('Профайл хуудас', () => {
  beforeEach(() => {
    // Бүх тест бүрт профайл хуудсыг үзэх
    cy.visit('/profile'); // Үнэн бодит URL эсвэл таны профайл хуудас руу зааж өгнө үү
  });

  it('Профайл мэдээллийг анхдагч байдлаар харах ёстой', () => {
    // Профайл хуудас зөв профайл мэдээлэлтэй байгаа эсэхийг шалгах
    cy.contains('Hi, Shagai').should('be.visible'); // Тавтай морилно уу мессеж
    cy.contains('n.shagai@pinecone.mn').should('be.visible'); // И-мэйл хаяг
    cy.get('p.text-lg.font-medium.text-zinc-950').contains('Personal Information'); // Личны мэдээлэл
  });

  it('Профайл болон Зураг табуудыг зөв өөрчлөх ёстой', () => {
    // Профайл таб нь анхдагч байдлаар идэвхтэй байгаа эсэхийг шалгах
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Profile').should('have.class', 'bg-zinc-100'); // Профайл таб идэвхтэй байж байгаа эсэх

    // Зураг таб руу дарж, тэр таб идэвхтэй болсон эсэхийг шалгах
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Images').click();
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Images').should('have.class', 'bg-zinc-100');
    cy.get('[data-cy=Tab-Navigation-Profile]').click();
    cy.get("[data-cy=Tab-Navigation]").should("be.visible")
    // cy.get('.rounded-md.text-sm.text-zinc-950').contains('Images').click();// Зураг таб идэвхтэй болсныг шалгах
  });

  it('Анхдагч байдлаар "Profile" табын агуулгыг харуулах ёстой', () => {
    // Профайл таб идэвхтэй байгаа үед профайл мэдээлэл харагдаж байгаа эсэхийг шалгах
    cy.contains('Personal Information');
    cy.get('input[placeholder="Elon"]').should('exist'); // Нэрийн талбар харагдаж байгаа эсэхийг шалгах
    cy.get('input[placeholder="Musk"]').should('exist'); // Имэйлийн талбар харагдаж байгаа эсэхийг шалгах
  });

  it('Зураг табын агуулгыг дарсны дараа харуулах ёстой', () => {
    // Зураг таб руу дарж
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Images').click();

    // Зураг табын агуулга харагдаж байгаа эсэхийг шалгах
    cy.get('.w-full.h-full.bg-red-200').should('exist'); // "Images" табын агуулга
    cy.get('p').contains('Odoogoor zurag baihgui baina !').should('exist'); // Зураг байхгүй гэсэн мессеж
  });

  it('Профайлыг "Update profile" товчийг дарж шинэчлэх ёстой', () => {
    // Профайл талбаруудад шинэ утгуудыг бичих
    cy.get('input[placeholder="Elon"]').clear().type('Elon Musk');
    cy.get('input[placeholder="Musk"]').clear().type('elon.musk@example.com');

    // Хоосон орших биографийн талбар (textarea) руу зөв харж байгаа эсэхийг шалгах
    cy.get('textarea[placeholder="Adventurous spirit with a passion for travel, photography, and discovering new cultures while pursuing a career in graphic design."]')
      .should('be.visible') // Биографийн талбар харагдаж байгааг шалгах
      .clear() // Хэрвээ ямар нэг утга байвал устгах
      .type('New bio content: Passionate about technology and innovation!'); // Шинэ биографи бичих

    // "Update profile" товчийг дарж
    cy.get('.w-32.h-9.bg-rose-600').click(); // Шинэчлэлт хийх товчлуур
  });

  it('Зөв сонирхлын жагсаалтыг харуулах ёстой', () => {
    // Бүх сонирхолуудын чипсүүдийг харуулж байгаа эсэхийг шалгах
    const interests = ['Art', 'Music', 'Investment', 'Technology', 'Design', 'Education', 'Health', 'Fashion', 'Travel', 'Food'];

    cy.get('.border.border-zinc-400.py-2.px-3.grid.grid-cols-9.gap-1.rounded-md')
      .children() // Сонирхолын чипсүүдийг авах
      .each((chip, index) => {
        cy.wrap(chip).contains(interests[index]);
      });
  });

  it('Зөв хугацааны сонголт үзүүлж буй огнооны талбар харагдах ёстой', () => {
    // Огнооны талбар байх эсэхийг шалгах
    cy.get('input[placeholder="21 Aug 1990"]').should('exist');

    // Мөн та хонхны дүрс дээр дарж, календарт тохирох үйлдлийг үзүүлэх боломжтой
    cy.get('.text-zinc-500.cursor-pointer').click(); // Хонхны дүрс байгаа эсэхийг шалгах
  });

  it('Хүйсийн талбар руу бичих боломжтой байх ёстой', () => {
    // Хүйсийн талбар байх эсэхийг шалгах
    cy.get('input[placeholder="Enter gender (e.g., Male, Female, Custom)"]').should('exist');

    // Хүйсийн талбарт бичих
    cy.get('input[placeholder="Enter gender (e.g., Male, Female, Custom)"]').clear().type('Male');

    // Бичсэн утга харагдаж байгаа эсэхийг шалгах
    cy.get('input[placeholder="Enter gender (e.g., Male, Female, Custom)"]').should('have.value', 'Male');
  });
});
