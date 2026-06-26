import { RegisterFormHeader, RegisterUserForm, RegisterWelcomePanel } from '../components'
import { useRegisterUser } from '../hooks/useRegisterUser'

import '../../../styles/RegisterPage.css'

export function RegisterPage() {
  const { registerNewUser } = useRegisterUser()

  return (
    <main className="register-page min-vh-100">
      <div className="container-fluid min-vh-100 p-0">
        <div className="row g-0 min-vh-100">
          <RegisterWelcomePanel />

          <section className="col-12 col-lg-7 bg-white">
            <div className="register-form-container h-100 d-flex align-items-center">
              <div className="w-100 p-4 p-md-5">
                <div className="register-form-content mx-auto">
                  <RegisterFormHeader />

                  <RegisterUserForm onRegister={registerNewUser} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
