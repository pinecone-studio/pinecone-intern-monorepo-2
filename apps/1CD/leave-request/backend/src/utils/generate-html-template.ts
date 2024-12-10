export const generateHtmlTemplate = (otp: string) => {
    return `<div style="overflow: auto;">
        <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
          <hr style="border: none; border-top: 1px solid #eee;" />
  
          <p style="font-size: 1.1em;">
            Сайн байна уу? Танд энэ өдрийн мэнд хүргэе.
          </p>
  
          <p style="margin: 0 auto; padding: 0 10px; text-align: center;">
            Таны нэг удаагийн баталгаажуулах код:
          </p>
          <h2
            style="
              background: #333;
              margin: 10px auto;
              width: max-content;
              padding: 10px;
              color: #fff;
              border-radius: 4px;
            "
          >
            ${otp}
          </h2>
          <p style="margin: 0 auto; width: max-content; padding: 0 10px;">
            энэхүү код нь 10 мин хүчинтэй болно.
          </p>
  
          <p style="font-size: 0.9em;">
            Хүндэтгэсэн,
            <br />
            HRMS ХХК
          </p>
          <hr style="border: none; border-top: 1px solid #eee;" />
        </div>
      </div>`;
  };