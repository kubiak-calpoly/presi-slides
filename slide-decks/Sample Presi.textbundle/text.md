---
title: Sample Presi
---

# Sample Presi {layout="title"}

---

# Slide One

- This is a simple slide
- It just has bullets
- It's boring, but it works.
- Time for more fun

---

# Slide Two



![](assets/image%206.png)

- This slide has a picture
- There are also bullets
- They should be side by side

---

# Slide 3

### Some Bullets

- Thing 1
- Thing 2
- Thing 3

### A Table

| Row Number | Thing    |
|------------|----------|
| 1          | Parsley  |
| 2          | Sage     |
| 3          | Rosemary |
| 4          | Thyme    |

---

# Slide 4

### Revealed Section 

- Secret {.reveal}
- Top Secret
- Super Top Secret

### Static Section

- You can see this
- if you want
- nothing special here

---
# Slide 5

![](assets/image%207.png) {.full}

---
# Slide 6 


![](assets/image%203.png){.full}

<!-- symmetry between Request and Response -->

|    | Request  | Response |
| --- | --- | --- |
| Start | `GET /en-US/docs/… HTTP/1.1` | `HTTP/1.1 404 Not Found` |
| Headers | `User-Agent: Mozilla/5.0…` | `Content-Type: application/json` |
| Body | `<!DOCTYPE html> <html lang="en"> … </html>` | `{"squadName": "SuperHeroSquad", …}`  |

---

# Slide 7

<aside>

> Cool URIs don't change {.full}
> 
> —Tim Berners-Lee {.attribution}

![](assets/image-timbl.png)

</aside>

- A resource's URL should never change
- Resource itself may change
- Physical storage location may change
  - Client shouldn't care

---
tags: #slides