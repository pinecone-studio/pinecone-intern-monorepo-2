describe('Профайл хуудасны тестүүд', () => {
  beforeEach(() => {
    // Тест бүрийн өмнө профайл хуудсыг нээх
    cy.visit('/profile');
  });

  it('Профайл мэдээлэл зөв харуулах ёстой', () => {
    // Хэрэглэгчийн нэр болон имэйл харагдаж байгааг шалгах
    cy.contains('Hi, Shagai').should('be.visible');
    cy.contains('n.shagai@pinecone.mn').should('be.visible');
  });

  it('Анхдагч байдлаар Profile табын агуулга харагдаж байх ёстой', () => {
    // "Personal Information" хэсэг харагдаж байгааг шалгах
    cy.contains('Personal Information').should('be.visible');
    
    // Нэр болон имэйл оруулах талбарууд байгаа эсэхийг шалгах
    cy.get('input[placeholder="Elon"]').should('exist');
    cy.get('input[placeholder="Musk"]').should('exist');
  });

  it('should check the tab', () => {
    cy.get('[data-cy="Tab-Navigation-Images"]').should('be.visible');
    
  });

  
  it('LucideMenu товчийг дарснаар sidebar харагдах эсэхийг шалгах', () => {
    // LucideMenu товч харагдаж байгаа эсэхийг шалгах
    cy.viewport(600, 1000);  // Жижиг дэлгэц дээр sidebar-ийг шалгах
    cy.get('[data-cy="menu"]').should('exist');

    // LucideMenu товчийг дарж, sidebar харагдаж байгааг шалгах
    cy.get('[data-cy="menu"]').click();
    cy.get('[data-cy="LucideMenu"]').should('be.visible');
  });
});

describe('GenderSelect Компонентын Тестүүд', () => {
  beforeEach(() => {
    // Тест бүрийн өмнө профайл хуудсыг нээх
    cy.visit('/profile');
  });

  it('GenderSelect харагдаж, сонголт хийх боломжтой байх ёстой', () => {
    // GenderSelect dropdown харагдаж байгаа эсэхийг шалгах
    cy.get('[data-cy="Gender-Select"]').should('exist');
    
    // Анхдагч утга болох "Female" сонголт байгаа эсэхийг шалгах
    cy.get('[data-cy="Gender-Select"]').contains('Female').should('be.visible');

    // GenderSelect дропдауныг дарж, "Male" сонгох
    cy.get('[data-cy="Gender-Select"]').click();
    cy.get('[data-cy="Gender-Select-Male"]').click();
    
    // "Male" сонгогдсон эсэхийг шалгах
    cy.get('[data-cy="Gender-Select"]').contains('Male').should('be.visible');
  });
});

describe('NextButton Тестүүд', () => {
  beforeEach(() => {
    // Тест бүрийн өмнө профайл хуудсыг нээх
    cy.visit('/profile');
  });

  it('Next товч харагдаж, дарах боломжтой байх ёстой', () => {
    // "Next" товч харагдаж байгаа эсэхийг шалгах
    cy.get('[data-cy="Next-Button"]').should('exist');

    // "Next" товчийг дарж, Images таб идэвхтэй болсоныг шалгах
    cy.get('[data-cy="Next-Button"]').click();

    // Images таб идэвхтэй болсоныг шалгах
    cy.get('[data-cy="Tab-Navigation-Images"]').should('have.class', 'bg-zinc-100');
  });
});
